<template>
  <div>
    <video ref="videoPlayer" class="video-js"></video>
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

<style lang="scss" scoped>
@import 'video.js/dist/video-js.css';
</style>
