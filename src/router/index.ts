import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/video-pc',
    name: 'video-pc',
    component: () => import(/* webpackChunkName: "video-pc" */ '../views/VideoPc.vue'),
  },
  {
    path: '/audio-pc',
    name: 'audio-pc',
    component: () => import(/* webpackChunkName: "audio-pc" */ '../views/AudioPc.vue'),
  },
  {
    path: '/share-pc',
    name: 'share-pc',
    component: () => import(/* webpackChunkName: "share-pc" */ '../views/SharePc.vue'),
  },
  {
    path: '/socket-text',
    name: 'socket-text',
    component: () => import(/* webpackChunkName: "socket-text" */ '../views/SocketText.vue'),
  },
  {
    path: '/socket-pc',
    name: 'socket-pc',
    component: () => import(/* webpackChunkName: "socket-pc" */ '../views/SocketPc.vue'),
  },
  {
    path: '/api-test',
    name: 'api-test',
    component: () => import(/* webpackChunkName: "api-test" */ '../views/ApiTest.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
