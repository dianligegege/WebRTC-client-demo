<template>
  <div class="video-wrap">
    <div class="local-video">
      <video :id="lovalVideoId" autoplay muted></video>
      <video id="customVideo" playsinline autoplay muted></video>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomVideoPlayer from '@/utils/video';
import { nextTick, onMounted, reactive, ref } from 'vue';
import WebRTCClient from '@/utils/rtc';

const lovalVideoId = 'localVideoId';

const videoPlayerLocal = ref();
const stream = ref();

const getStream = async () => {
  try {
    const stream1 = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    console.log('zl-stream1.value', stream1);
    const { videoElement } = videoPlayerLocal.value;
    if (videoElement) {
      videoElement.srcObject = stream1;
    }
    const customVideo = document.querySelector('#customVideo') as HTMLVideoElement;
    if (customVideo) customVideo.srcObject = stream1;
  } catch (error) {
    console.log('error', error);
  }
};

const onPlayerReady = async () => {
  console.log('onPlayerReady');
  await getStream();
};

const onPlay = () => {
  console.log('onPlay');
};

const onError = (e) => {
  console.log('e', e);
};

onMounted(() => {
  nextTick(() => {
    videoPlayerLocal.value = new CustomVideoPlayer({
      videoElementId: lovalVideoId,
      // customOptions: localOptions,
      onPlayerReady,
      onPlay,
      onError,
    });
  });
});
</script>

<style lang="scss">
.video-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  > div {
    margin: 16px;
    width: 500px;
    height: 282px;
  }

  #customVideo {
    width: 500px;
    height: 300px;
    border: 1px solid #ccc;
  }
}
</style>
