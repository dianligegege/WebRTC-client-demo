<template>
  <div class="btn-wrap">
    <button @click="start">开始</button>
    <button @click="close">关闭</button>
  </div>
  <div class="video-wrap">
    <div class="local-video">
      <video :id="lovalVideoId" autoplay muted></video>
    </div>
  </div>
  <div>
    <h3>房间号：{{ roomId }}</h3>
  </div>
  <div>
    <div v-for="message in messages" :key="message.id">{{ message.sender }}: {{ message.text }}</div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
  </div>
  <div class="btn-wrap">
    <button @click="leaveRoom">退房</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import io from 'socket.io-client';
import WebRTCClient from '@/utils/rtc';
import createPlayer from '@/utils/createPlayer';

interface Message {
  id: number;
  sender: string;
  text: string;
}

// socket 相关
const roomId = 'room2';
const userName = `user${Math.floor(Math.random() * 100)}`;

const socket = io('https://web-rtc-server-demo-qscqjjkls-dianligegeges-projects.vercel.app');
const messages = ref<Message[]>([]);
const newMessage = ref('');

// WebRTC 相关
const lovalVideoId = 'localVideoId';
const remoteVideoId = 'remoteVideoId';
let remoteVideo: HTMLVideoElement;
let localVideo: HTMLVideoElement;
const localOptions = {
  autoplay: true,
  controls: false,
  muted: true,
};
const lovalPlayer = ref();
const pcLocal: any = ref();
let pc1: any;
let localStream: any;

async function handlePlayer() {
  lovalPlayer.value = createPlayer({
    videoElementId: lovalVideoId,
    customOptions: localOptions,
  });
  localVideo = lovalPlayer.value.el().querySelector('video') as HTMLVideoElement;
}

function handleRtc() {
  pcLocal.value = new WebRTCClient({
    onTrack(e) {
      if (e.streams.length > 0 && localVideo) {
        [localVideo.srcObject] = e.streams;
      }
    },
  });

  pc1 = pcLocal.value?.pc;

  pc1.addEventListener('icecandidate', async (e) => {
    if (e.candidate) {
      console.log('zl-icecandidate', e.candidate);
      socket.emit('toIce', {
        roomId,
        userName,
        type: 'ice',
        candidate: e.candidate,
      });
    }
  });
}

async function createOffer() {
  const offer = await pcLocal.value?.createOffer();
  console.log('zl-createOffer-offer', offer);
  socket.emit('toOffer', {
    roomId,
    userName,
    offer,
  });
}

async function handleStream() {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  localStream.getTracks().forEach((track: any) => pc1.addTrack(track, localStream));
}

function close() {
  if (localStream) {
    localStream.getTracks().forEach((track: any) => {
      track.stop();
    });
  }
  if (pc1) pc1.close();
  pc1 = null;
  pcLocal.value = null;
}

function sendMessage() {
  if (newMessage.value) {
    const message = {
      id: Date.now(),
      sender: userName,
      text: newMessage.value,
      roomId,
    };
    messages.value.push(message);
    socket.emit('toMessage', message);
    newMessage.value = '';
  }
}

function leaveRoom() {
  socket.emit('toLeave', {
    roomId,
    userName,
  });
}

function start() {
  createOffer();
}

onMounted(() => {
  handlePlayer();
  handleRtc();
  nextTick(async () => {
    await handleStream();
  });

  socket.on('connect', () => {
    socket.emit('toJoin', {
      roomId,
      userName,
    });
  });

  socket.on('message', (message) => {
    messages.value.push(message);
  });

  socket.on('leave', (data) => {
    messages.value.push({
      id: Date.now(),
      sender: '系统消息',
      text: `${data.userName}离开了房间`,
    });
  });

  socket.on('full', () => {
    alert('房间已满');
  });

  socket.on('ice', async (data) => {
    console.log('zl-receive-ice', data);
    pcLocal.value?.addIceCandidate(data.candidate);
  });

  socket.on('offer', async (data) => {
    console.log('zl-receive-offer', data);
    pcLocal.value?.saveRemoteDescription(data.offer);
    const answer = await pcLocal.value?.createAnswer();
    socket.emit('toAnswer', {
      roomId,
      userName,
      answer,
    });
  });

  socket.on('answer', async (data) => {
    console.log('zl-receive-answer', data);
    pcLocal.value?.saveRemoteDescription(data.answer);
  });
});

// 注销组件时机
onUnmounted(() => {
  leaveRoom();
});
</script>

<style lang="scss" scoped>
.btn-wrap {
  margin-top: 20px;
  button {
    margin: 0 24px;
  }
}
.video-wrap {
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    margin: 16px;
    width: 500px;
    height: 282px;
  }
}
</style>
