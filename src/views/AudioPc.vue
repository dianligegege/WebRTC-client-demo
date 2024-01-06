<template>
  <div class="audio-wrap">
    <div class="btn-wrap">
      <button @click="start">开始</button>
      <button @click="close">关闭</button>
    </div>
    <div class="remote-audio">
      <audio id="audioRemote" autoplay controls></audio>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import WebRTCClient from '@/utils/rtc';

let remoteAudio: any;

const pcLocal: any = ref();
const pcRemote: any = ref();
let pc1: any;
let pc2: any;

let localStream: any;

function handleRtc() {
  pcLocal.value = new WebRTCClient({});
  pcRemote.value = new WebRTCClient({
    onTrack(e) {
      if (e.streams.length > 0 && remoteAudio) {
        [remoteAudio.srcObject] = e.streams;
      }
    },
  });

  pc1 = pcLocal.value?.pc;
  pc2 = pcRemote.value?.pc;

  pc1.addEventListener('icecandidate', async (e) => {
    console.log('zl-icecandidate');
    if (e.candidate) {
      await pcRemote.value?.addIceCandidate(e.candidate);
    }
  });

  pc2.addEventListener('icecandidate', async (e) => {
    if (e.candidate) {
      await pcLocal.value.addIceCandidate(e.candidate);
    }
  });
}

async function createOffer() {
  const offer = await pcLocal.value?.createOffer();
  await pcRemote.value?.saveRemoteDescription(offer);
  const answer = await pcRemote.value?.createAnswer();
  await pcLocal.value?.saveRemoteDescription(answer);
}

async function handlePlayer() {
  remoteAudio = document.getElementById('audioRemote') as HTMLAudioElement;
}

async function handleStream() {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });

  localStream.getTracks().forEach((track: any) => pc1.addTrack(track, localStream));
}

async function close() {
  if (localStream) {
    localStream.getTracks().forEach((track: any) => track.stop());
  }
  if (pc1) {
    pc1.close();
    pc1 = null;
  }
}

async function start() {
  close();
  await handleRtc();
  nextTick(async () => {
    await handleStream();
    await createOffer();
  });
}

onMounted(async () => {
  nextTick(async () => {
    await handlePlayer();
  });
});
</script>

<style lang="scss">
.audio-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .btn-wrap {
    margin-bottom: 30px;

    > button {
      margin: 0 10px;
    }
  }
}
</style>
