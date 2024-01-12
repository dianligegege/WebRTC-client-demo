<template>
  <div class="directory">
    <h2>项目目录</h2>
    <ul>
      <li v-for="route in routes" :key="route.path">
        <router-link :to="route.path">{{ route.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routes: [
        { path: '/', name: '首页' },
        { path: '/video-pc', name: '视频本地传输' },
        { path: '/audio-pc', name: '音频本地传输' },
        { path: '/share-pc', name: '分享本地传输' },
        { path: '/socket-text', name: 'socket传输文本' },
        { path: '/socket-pc', name: '视频远程传输' },
      ],
    };
  },
};
</script>

<style scoped>
.directory {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
}

.directory h2 {
  margin-bottom: 10px;
}

.directory ul {
  list-style-type: none;
  padding: 0;
}

.directory li {
  margin-bottom: 5px;
}

.directory li a {
  color: #333;
  text-decoration: none;
}

.directory li a:hover {
  text-decoration: underline;
}
</style>
