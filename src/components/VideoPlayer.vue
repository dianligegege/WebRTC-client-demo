<template>
  <video ref="videoPlayer" class="video-js vjs-video-box vjs-default-skin"></video>
</template>

<script lang="ts" setup>
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  options: {
    type: Object,
    default() {
      return {};
    },
  },
});

const player = ref<Player>();
const videoPlayer = ref<HTMLElement>();

onMounted(() => {
  if (videoPlayer.value) {
    player.value = videojs(
      videoPlayer.value,
      {
        autoplay: false,
        controls: true,
        ...props.options,
      },
      () => {
        player.value?.log('onPlayerReady', this);
      },
    );
  }
});

onUnmounted(() => {
  if (player.value) {
    player.value.dispose();
  }
});
</script>

<style lang="scss">
@import 'video.js/dist/video-js.css';
@import 'src/assets/styles/video.scss';

.vjs-video-box {
  width: 100%;
  height: 100%;
  max-width: 100%;
}
</style>
