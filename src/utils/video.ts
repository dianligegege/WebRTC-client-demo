import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import '@/assets/styles/video.scss';

interface Iprops {
  videoElementId: string,
  customOptions?: any,
  onPlayerReady?: (e: any) => void,
  onPlay?: (e: any) => void,
  onPause?: (e: any) => void,
  onEnded?: (e: any) => void,
  onError?: (e: any) => void,
}

class CustomVideoPlayer {
  private player: Player;

  public videoElement;

  constructor({
    videoElementId,
    customOptions,
    onPlayerReady,
    onPlay,
    onPause,
    onEnded,
    onError,
  }: Iprops) {
    this.player = videojs(videoElementId, {
      autoplay: false,
      controls: true,
      ...customOptions,
    });
    this.player.addClass('video-js vjs-video-box vjs-default-skin');

    this.videoElement = this.player.el().querySelector('video');
    if (onPlayerReady) this.player.on('ready', onPlayerReady);
    // 监听播放开始事件
    if (onPlay) this.player.on('play', onPlay);
    // 监听暂停事件
    if (onPause) this.player.on('pause', onPause);
    // 监听结束事件
    if (onEnded) this.player.on('ended', onEnded);
    // 监听错误事件
    if (onError) this.player.on('error', onError);
  }

  play(): void {
    this.player.play();
  }

  pause(): void {
    this.player.pause();
  }

  setSource(source: string): void {
    this.player.src(source);
  }

  setPoster(poster: string): void {
    this.player.poster(poster);
  }

  setOptions(options: any): void {
    this.player.options(options);
  }

  dispose(): void {
    this.player.dispose();
  }

  getOriginalPlayer(): Player {
    return this.player;
  }
}

export default CustomVideoPlayer;
