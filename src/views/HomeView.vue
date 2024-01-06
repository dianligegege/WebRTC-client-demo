<template>
  <div class="home">
    <VideoPlayer :options="options" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import VideoPlayer from '@/components/VideoPlayer.vue';
import { getMedia, getDevices } from '@/utils/media';

export default defineComponent({
  name: 'HomeView',
  components: {
    VideoPlayer,
  },
  setup() {
    const options = reactive({
      autoplay: true,
      controls: true,
      sources: [
        {
          src: '/loki.mp4',
          type: 'video/mp4',
        },
      ],
    });

    onMounted(() => {
      getMedia();
      getDevices();
    });

    return {
      options,
    };
  },
});
</script>

<style lang="scss">
.vjs-video-box {
  width: 800px;
  height: 450px;
}
</style>
