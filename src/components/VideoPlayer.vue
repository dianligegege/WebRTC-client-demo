<template>
  <div>
    <video ref="videoPlayer" class="video-js vjs-video-box"></video>
  </div>
</template>

<script lang="ts" setup>
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import {
  onMounted, onUnmounted, ref,
} from 'vue';

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
      props.options,
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

.vjs-video-box {
  width: 100vmin;
  height: 56.25vmin;
  max-width: 100%;
}
</style>
