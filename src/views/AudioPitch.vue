<template>
  <div>
    <h1>Microphone Pitch</h1>
    <div>
      <button @click="startRecording">Start Recording</button>
      <button @click="stopRecording">Stop Recording</button>
    </div>
    <h2>Pitch: {{ pitch }}</h2>
    <canvas id="canvas1" ref="canvas"></canvas>
    <canvas id="canvas3" ref="canvas3"></canvas>
    <div class="canvas-wrap">
      <canvas width="600" height="300" id="canvas2" ref="canvas2"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const pitch = ref(null);
const mediaStream = ref(null);
const audioContext = ref(null);
const analyser = ref(null);
const bufferLength = ref(0);
const dataArray = ref(null);
const rafId = ref(null);
const canvas = ref(null);
const canvasContext = ref(null);
const canvas3 = ref(null);
const canvasContext3 = ref(null);
const canvas2 = ref(null);
const canvasContext2 = ref(null);
const source = ref(null);
const startTime = ref(null);
const canvasWrapDom = ref(null);

// 获取音调和音符
function frequencyToNote(frequency, referenceFrequency = 440, key = 'C', scaleName = 'major') {
  // 定义标准音名和对应的频率（A4为440Hz）
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  // 定义常见音阶的音程模式
  const scales = {
    major: [2, 2, 1, 2, 2, 2, 1],
    naturalMinor: [2, 1, 2, 2, 1, 2, 2],
    harmonicMinor: [2, 1, 2, 2, 1, 3, 1],
    // 添加更多音阶模式
  };
  // 获取指定音阶的音程模式
  const scaleIntervals = scales[scaleName] || scales.major;
  // 找到指定调性的起始音符索引
  const startIndex = noteNames.indexOf(key);
  // 计算距离最近的参考音符的半音数
  const semitonesFromReference = Math.round(12 * Math.log2(frequency / referenceFrequency));
  // 计算音符的八度
  const octave = Math.floor(startIndex / 7);
  // 计算相对于参考音符的半音数（在一个八度内）
  let relativeSemitones = ((semitonesFromReference % 12) + 12) % 12;
  // 在指定音阶的音程模式中查找音符
  let noteIndex = startIndex;
  // eslint-disable-next-line no-restricted-syntax
  for (const interval of scaleIntervals) {
    if (relativeSemitones >= interval) {
      relativeSemitones -= interval;
      noteIndex = (noteIndex + 1) % 12;
    } else {
      break;
    }
  }
  // 获取音名
  const noteName = noteNames[noteIndex];
  // 返回音符名称和八度
  return { noteName, octave };
}

// 获取音高
function autoCorrelate(buf, sampleRate) {
  const SIZE = buf.length;
  const GOOD_ENOUGH_CORRELATION = 0.9;
  const MIN_SAMPLES = 4;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  let best_offset = -1;
  let best_correlation = 0;
  let rms = 0;
  let foundGoodCorrelation = false;
  const correlations = new Array(MAX_SAMPLES);

  for (let i = 0; i < SIZE; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) {
    // not enough signal
    return -1;
  }

  let lastCorrelation = 1;
  for (let offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;

    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buf[i] - buf[i + offset]);
    }
    correlation = 1 - correlation / MAX_SAMPLES;
    correlations[offset] = correlation; // store it, for the tweaking we need to do below.
    if (correlation > GOOD_ENOUGH_CORRELATION && correlation > lastCorrelation) {
      foundGoodCorrelation = true;
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    } else if (foundGoodCorrelation) {
      const shift = (correlations[best_offset + 1] - correlations[best_offset - 1]) / correlations[best_offset];
      return sampleRate / (best_offset + 8 * shift);
    }
    lastCorrelation = correlation;
  }
  if (best_correlation > 0.01) {
    return sampleRate / best_offset;
  }
  return -1;
}

// 获取频率
function getFrequencyFromFFT(fft, sampleRate) {
  const peak = fft.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);
  const freq = peak * (sampleRate / fft.length);
  return freq;
}

let lastX = 0;
const drawNote = (time, pitchVal, noteName, octave) => {
  // console.log('zl-noteName', noteName);
  // console.log('zl-pitchVal', pitchVal);
  const itemWidth = 20;
  // canvasContext2.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // for (let i = 0; i < audioData.length; i++) {
  // const x = (time - startTime.value) / 1000; // convert time to seconds
  const x = lastX + itemWidth;
  lastX += itemWidth;
  // 音调的Y轴坐标，从下向上排列
  // const y = (pitchVal / 100) * 200;
  const y = 300 - pitchVal / 20 - 12;
  console.log('x-y', x, y);
  canvasContext2.value.fillRect(x, y, itemWidth, 2); // draw a 1x1 pixel at (x, y)
  // 在块上写上音符noteName
  canvasContext2.value.font = '10px serif';
  canvasContext2.value.fillText(`${noteName} ${octave}`, x, y - 8);
  canvasContext2.value.fillText(pitchVal, x, y + 12);
  // }
  // x大于1000时，增加canvas宽度并且自动滚动到最右侧
  if (x > canvas2.value.width) {
    // 保存图像数据
    const imageData = canvasContext2.value.getImageData(0, 0, canvas2.value.width, canvas2.value.height);

    const width = canvas2.value.width + 100;
    canvas2.value.width = width;
    // 恢复图像数据
    canvasContext2.value.putImageData(imageData, 0, 0);
    // canvasWrapDom.value.scrollLeft = width;
    canvas2.value.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
  }
};

const dataArray2 = ref(null);

const draw = () => {
  analyser.value.getByteFrequencyData(dataArray2.value);
  const canvasWidth = canvas3.value.width;
  const canvasHeight = canvas3.value.height;
  const canvasCtx = canvasContext3.value;
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
  const barWidth = (canvasWidth / bufferLength.value) * 2.5;
  let barHeight;
  let x = 0;
  for (let i = 0; i < bufferLength.value; i += 1) {
    barHeight = dataArray2.value[i] / 2;
    canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
    canvasCtx.fillRect(x, canvasHeight - barHeight / 2, barWidth, barHeight / 2);
    x += barWidth + 1;
  }
};

const updatePitch = () => {
  draw();

  analyser.value.getByteTimeDomainData(dataArray.value);
  // Calculate pitch here using the dataArray
  // pitch.value = autoCorrelate(dataArray.value, sampleRate);
  // 你需要确保你有正确的音频数据和分析器
  // pitch.value = autoCorrelate(dataArray2.value, source.value.context.sampleRate);
  pitch.value = getFrequencyFromFFT(dataArray2.value, source.value.context.sampleRate);
  // console.log(`Detected pitch: ${pitch.value}`);
  // ...
  if (pitch.value !== -1) {
    const { noteName, octave } = frequencyToNote(pitch.value);
    // console.log('zl-pitch.value', pitch.value);
    // console.log('zl-noteName', noteName);
    // console.log('zl-octave', octave);
    drawNote(Date.now(), pitch.value, noteName, octave);
  }

  // Draw the waveform on the canvas
  const canvasWidth = canvas.value.width;
  const canvasHeight = canvas.value.height;
  const canvasCtx = canvasContext.value;
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
  canvasCtx.beginPath();
  const sliceWidth = (canvasWidth * 1.0) / bufferLength.value;
  let x = 0;
  for (let i = 0; i < bufferLength.value; i += 1) {
    const v = dataArray.value[i] / 128.0;
    const y = (v * canvasHeight) / 2;
    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx.lineTo(canvasWidth, canvasHeight / 2);
  canvasCtx.stroke();

  rafId.value = requestAnimationFrame(updatePitch);
};

// `startRecording` 方法用于开始音频录制并设置音频分析。
const startRecording = () => {
  // 使用 `navigator.mediaDevices.getUserMedia` 方法获取用户的音频输入（例如麦克风）。
  // 这个方法返回一个 Promise，当用户允许访问麦克风时，这个 Promise 会解析为一个 MediaStream 对象。
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      // 将获取到的 MediaStream 对象存储在 `mediaStream.value` 中。
      mediaStream.value = stream;
      // 创建一个新的 AudioContext 对象，这是 Web Audio API 的主要入口点。
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
      // 创建一个 AnalyserNode 对象，用于提供实时频率和时间域分析信息。
      analyser.value = audioContext.value.createAnalyser();
      analyser.value.fftSize = 256;
      // 获取 AnalyserNode 的频率数据的长度，并存储在 `bufferLength.value` 中。
      bufferLength.value = analyser.value.frequencyBinCount;
      // 创建一个 Uint8Array 来存储分析数据。
      dataArray.value = new Uint8Array(bufferLength.value);
      dataArray2.value = new Uint8Array(bufferLength.value);
      // 使用 `audioContext.createMediaStreamSource` 方法创建一个 MediaStreamAudioSourceNode 对象，
      // 这个对象表示来自 MediaStream 的音频源。
      source.value = audioContext.value.createMediaStreamSource(stream);
      // 使用 `source.connect` 方法将音频源连接到分析器，这样分析器就可以接收并分析音频数据了。
      source.value.connect(analyser.value);

      // 使用 `requestAnimationFrame` 方法开始更新音高。这个方法会在下一次重绘之前调用指定的函数，
      // 这样你就可以在每一帧中更新音高。
      rafId.value = requestAnimationFrame(updatePitch);
      startTime.value = Date.now();
    })
    // 如果在任何地方发生错误（例如用户拒绝访问麦克风），捕获这个错误并在控制台中打印错误信息。
    .catch((error) => {
      console.error('Error accessing microphone:', error);
    });
};

const stopRecording = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
    mediaStream.value = null;
  }
  if (audioContext.value) {
    audioContext.value.close();
    audioContext.value = null;
  }
  cancelAnimationFrame(rafId.value);
  pitch.value = null;
};

onMounted(() => {
  nextTick(() => {
    // canvas.value = document.querySelector('canvas');
    canvasContext.value = canvas.value.getContext('2d');
    canvasContext2.value = canvas2.value.getContext('2d');
    canvasWrapDom.value = document.querySelector('.canvas-wrap');
    canvasContext3.value = canvas3.value.getContext('2d');
  });
});

onUnmounted(() => {
  stopRecording();
});
</script>

<style lang="scss">
.canvas-wrap {
  margin: 0 auto;
  width: 600px;
  overflow: scroll;
  background-color: #ccc;
  transition: scrollLeft 0.5s;
  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
