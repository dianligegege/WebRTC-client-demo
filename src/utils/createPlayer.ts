import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import '@/assets/styles/video.scss';

interface Iprops {
  videoElementId: string,
  customOptions?: any,
}

export default function createPlayer({
  videoElementId,
  customOptions,
}: Iprops) {
  const player: Player = videojs(videoElementId, {
    autoplay: false,
    controls: true,
    ...customOptions,
  });
  player.addClass('video-js vjs-video-box vjs-default-skin');
  return player;
}
