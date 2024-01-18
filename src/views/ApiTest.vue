<template>
  <div>
    <button :disabled="disabled" @click="sendRequest">Send Request</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const disabled = ref(false);
// const domain = 'https://web-rtc-server-demo-qscqjjkls-dianligegeges-projects.vercel.app';
const domain = 'https://web-rtc-server-demo.vercel.app';
// const domain = 'https://10.17.25.252:3001';
async function sendRequest() {
  disabled.value = true;
  try {
    const response = await fetch(`${domain}/api/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    disabled.value = false;

    if (response.ok) {
      const data = await response.json();
      console.log('zl-data', data);
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    disabled.value = false;
    console.error(error);
  }
}
</script>
