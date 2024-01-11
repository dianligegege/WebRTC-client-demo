<template>
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
import { ref, onMounted, onUnmounted } from 'vue';
import io from 'socket.io-client';

interface Message {
  id: number;
  sender: string;
  text: string;
}

const roomId = 'room1';
// 随机username
const userName = `user${Math.floor(Math.random() * 100)}`;

const socket = io('https://10.17.25.252:3000');
const messages = ref<Message[]>([]);
const newMessage = ref('');

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

onMounted(() => {
  socket.on('connect', () => {
    console.log('zl-join', '进入直播间');
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
});

// 注销组件时机
onUnmounted(() => {
  leaveRoom();
});
</script>

<style lang="scss">
.btn-wrap {
  margin-top: 20px;
}
</style>
