<template>
  <div class="home">
    <Player />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Player from "@/components/VideoPlayer.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    Player,
  },
});
</script>
