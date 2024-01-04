<template>
  <div class="video-wrap">
    <div class="local-video">
      <video :id="lovalVideoId"></video>
      <!-- <VideoPlayer :options="localOptions" :ref="refVideoLocal" /> -->
    </div>
    <div class="remote-video">
      <!-- <VideoPlayer :options="remoteOptions" :ref="refVideoRemote" /> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
// import VideoPlayer from '@/components/VideoPlayer.vue';
import CustomVideoPlayer from '@/utils/video';
import { nextTick, onMounted, reactive, ref } from 'vue';
import WebRTCClient from '@/utils/rtc';

const lovalVideoId = 'localVideoId';

const videoPlayerLocal = ref();
// const refVideoRemote = ref();

const localOptions = {
  sources: [
    {
      src: '/loki.mp4',
      type: 'video/mp4',
    },
  ],
};
// const remoteOptions = reactive({});

// const localVideoCanPlay = () => {
//   const stream = refVideoLocal.value.captureStream();
//   console.log('zl-stream', stream);
// };

const onPlayerReady = (e) => {
  console.log('onPlayerReady', e);
  const player = videoPlayerLocal.value.getOriginalPlayer();
  console.log('zl-player', player);
  videoPlayerLocal.value.getOriginalPlayer().muted(false);
  try {
    player.play();
  } catch (error) {
    console.log('zl-error', error);
  }
  // videoPlayerLocal.value.play();
};

onMounted(() => {
  nextTick(() => {
    videoPlayerLocal.value = new CustomVideoPlayer({
      videoElementId: lovalVideoId,
      customOptions: localOptions,
      onPlayerReady,
    });
    // refVideoLocal.value.oncanPlay = localVideoCanPlay;
    // // 本地
    // const pcLocal = new WebRTCClient({
    //   icecandidate: (e) => {
    //     console.log('icecandidate', e);
    //   },
    //   track: (e) => {
    //     console.log('track', e);
    //   },
    // });
  });
  console.log('onMounted');
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
}
</style>
