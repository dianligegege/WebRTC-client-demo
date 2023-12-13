<template>
  <div class="home">
    <VideoPlayer/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import HelloWorld from '@/components/HelloWorld.vue';
import VideoPlayer from '@/components/VideoPlayer.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    VideoPlayer,
  },
});
</script>
