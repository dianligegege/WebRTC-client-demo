<template>
  <div class="video-wrap">
    <div class="local-video">
      <VideoPlayer :options="localOptions" :ref="refVideoLocal" />
    </div>
    <div class="remote-video">
      <VideoPlayer :options="remoteOptions" :ref="refVideoRemote" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import VideoPlayer from '@/components/VideoPlayer.vue';
import { nextTick, onMounted, reactive, ref } from 'vue';
import WebRTCClient from '@/utils/rtc';

const refVideoLocal = ref();
const refVideoRemote = ref();

const localOptions = reactive({
  sources: [
    {
      src: '/loki.mp4',
      type: 'video/mp4',
    },
  ],
});
const remoteOptions = reactive({});

const localVideoCanPlay = () => {
  const stream = refVideoLocal.value.captureStream();
  console.log('zl-stream', stream);
};

onMounted(() => {
  nextTick(() => {
    refVideoLocal.value.oncanPlay = localVideoCanPlay;
    // 本地
    const pcLocal = new WebRTCClient({
      icecandidate: (e) => {
        console.log('icecandidate', e);
      },
      track: (e) => {
        console.log('track', e);
      },
    });
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
