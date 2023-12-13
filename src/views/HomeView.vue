<template>
  <div class="home">
    <VideoPlayer
      :options="options"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import VideoPlayer from '@/components/VideoPlayer.vue';

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

    return {
      options,
    };
  },
});
</script>
