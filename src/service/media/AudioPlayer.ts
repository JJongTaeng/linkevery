export class AudioPlayer {
  private audio: HTMLAudioElement = new Audio();
  private audioContext: AudioContext = new AudioContext();
  private sourceNode?: MediaStreamAudioSourceNode;
  private gainNode: GainNode;

  constructor(stream: MediaStream) {
    this.audio.srcObject = stream;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.5;

    this.audio.onloadedmetadata = () => {
      this.audio.muted = true;
      this.audio.play().then(() => {
        this.sourceNode = this.audioContext.createMediaStreamSource(
          this.audio.srcObject as MediaStream,
        );
        this.sourceNode
          .connect(this.gainNode)
          .connect(this.audioContext.destination);
      });
    };
  }

  // 볼륨 조절 메서드
  setVolume(volume: number) {
    this.gainNode.gain.value = volume;
  }

  // 오디오 처리 정지
  stopAudioProcessing() {
    this.sourceNode?.disconnect();
    this.gainNode.disconnect();
    this.audioContext.close();

    this.audio.pause();
    // @ts-ignore
    const tracks = this.audio.srcObject?.getTracks();
    if (!tracks) return;
    tracks.forEach((track: any) => {
      track.stop();
    });
    this.audio.remove();
    this.audio.srcObject = null;
  }
}
