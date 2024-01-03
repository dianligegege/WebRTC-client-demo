type ClientType = 'local' | 'remote';

interface IProp {
  clientType?: ClientType,
  icecandidate?: (e: RTCIceCandidate) => void,
  iceconnectionstatechange?: (e: Event) => void,
  track?: (e: any) => void;
}

export default class WebRTCClient {
  pc: RTCPeerConnection;

  isLocal: boolean;

  constructor({
    clientType = 'local',
    icecandidate,
    iceconnectionstatechange,
    track,
  }: IProp) {
    this.isLocal = clientType === 'local';
    this.pc = new RTCPeerConnection();
    if (icecandidate) this.onIcecandidate(icecandidate);
    if (iceconnectionstatechange) this.onIceconnectionstatechange(iceconnectionstatechange);
    if (track) this.onTrack(track);
  }

  // icecandidate
  // 包含通信协议(TCP/UDP)和通信IP， STUN和TURN协议中描述网络信息的格式规范 ，解决双方网络链接问题
  onIcecandidate = (cb: (e: RTCIceCandidate) => void) => {
    this.pc?.addEventListener('icecandidate', async (e) => {
      if (e?.candidate && cb) cb(e.candidate);
    });
  }

  onIceconnectionstatechange = (cb: (e: Event) => void) => {
    this.pc?.addEventListener('iceconnectionstatechange', (e) => {
      if (cb) cb(e);
    });
  }

  onTrack = (cb: (e: any) => void) => {
    this.pc?.addEventListener('track', (e) => {
      if (cb) cb(e);
    });
  }

  addIceCandidate = (candidate: RTCIceCandidate) => {
    this.pc?.addIceCandidate(candidate);
  }

  // SDP
  // 浏览器能力，包括不限于音视频编码格式，带宽，流控策略等
  createOffer = async () => {
    const offer = await this.pc?.createOffer();
    this.pc?.setLocalDescription(offer);
    return offer;
  }

  createAnswer = async () => {
    const answer = await this.pc?.createAnswer();
    this.pc?.setLocalDescription(answer);
    return answer;
  }

  saveOffer = async (offer: any) => {
    this.pc?.setRemoteDescription(offer);
  }

  saveAnswer = async (answer: any) => {
    this.pc?.setRemoteDescription(answer);
  }

  // track
  addTrack = (track: MediaStreamTrack, localStream: MediaStream) => {
    this.pc?.addTrack(track, localStream);
  }
}
