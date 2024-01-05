<template>
  <div class="video-wrap">
    <div class="local-video">
      <video :id="lovalVideoId" autoplay muted></video>
    </div>
    <div class="remote-video">
      <video :id="remoteVideoId" autoplay muted></video>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import CustomVideoPlayer from '@/utils/video';
import { nextTick, onMounted, reactive, ref } from 'vue';
import WebRTCClient from '@/utils/rtc';
import createPlayer from '@/utils/createPlayer';

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
const remotePlayer = ref();

const pcLocal: any = ref();
const pcRemote: any = ref();
let pc1: any;
let pc2: any;

function handleRtc() {
  pcLocal.value = new WebRTCClient({});
  pcRemote.value = new WebRTCClient({
    onTrack(e) {
      if (e.streams.length > 0 && remoteVideo) {
        [remoteVideo.srcObject] = e.streams;
      }
    },
  });

  pc1 = pcLocal.value?.pc;
  pc2 = pcRemote.value?.pc;

  pc1.addEventListener('icecandidate', async (e) => {
    console.log('zl-icecandidate');
    if (e.candidate) {
      await pcRemote.value?.addIceCandidate(e.candidate);
    }
  });

  pc2.addEventListener('icecandidate', async (e) => {
    if (e.candidate) {
      await pcLocal.value.addIceCandidate(e.candidate);
    }
  });
}

async function createOffer() {
  const offer = await pcLocal.value?.createOffer();
  await pcRemote.value?.saveRemoteDescription(offer);
  const answer = await pcRemote.value?.createAnswer();
  await pcLocal.value?.saveRemoteDescription(answer);
}

async function handlePlayer() {
  lovalPlayer.value = createPlayer({
    videoElementId: lovalVideoId,
    customOptions: localOptions,
  });
  remotePlayer.value = createPlayer({
    videoElementId: remoteVideoId,
    customOptions: localOptions,
  });
  remoteVideo = remotePlayer.value.el().querySelector('video') as HTMLVideoElement;
  localVideo = lovalPlayer.value.el().querySelector('video') as HTMLVideoElement;
}

async function handleStream() {
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  if (localVideo) {
    localVideo.srcObject = localStream;
  }
  localStream.getTracks().forEach((track) => pc1.addTrack(track, localStream));
}

onMounted(async () => {
  handleRtc();
  nextTick(async () => {
    await handlePlayer();
    await handleStream();
    // 创建offer放在addTrack之后
    await createOffer();
  });
});
</script>

<style lang="scss">
.video-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  > div {
    margin: 16px;
    width: 500px;
    height: 282px;
  }
}
</style>
