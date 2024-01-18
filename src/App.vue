<template>
  <div>
    <nav>
      <ul class="navigation">
        <li v-for="route in routes" :key="route.path" :class="{ active: isActiveRoute(route.path) }">
          <router-link :to="route.path">{{ route.name }}</router-link>
        </li>
      </ul>
    </nav>
    <!-- 添加一个吸顶导航，方便跳转到各个导航页面 -->
  </div>
  <router-view />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const routes = [
  { path: '/', name: '首页' },
  { path: '/video-pc', name: '视频本地传输' },
  { path: '/audio-pc', name: '音频本地传输' },
  { path: '/share-pc', name: '分享本地传输' },
  { path: '/socket-text', name: 'socket传输文本' },
  { path: '/socket-pc', name: '视频远程传输' },
  { path: '/api-test', name: '接口测试' },
];

const isActiveRoute = (path: string) => {
  const route = useRoute();
  return route.path === path;
};
</script>

<style lang="scss">
@import '@/assets/styles/custom.scss';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.navigation {
  list-style: none;
  display: flex;
  justify-content: center;
  background-color: #f2f2f2;
  padding: 10px;
}

.navigation li {
  margin: 0 10px;

  &.active {
    a {
      color: #ff0000;
    }
  }
}

.navigation li a {
  text-decoration: none;
  color: #333;
  padding: 5px;
}

.navigation li a:hover {
  color: #ff0000;
}
</style>
