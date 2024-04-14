export class AudioStream {
  private audio: HTMLAudioElement = new Audio();
  private audioContext: AudioContext = new AudioContext();
  private sourceNode?: MediaStreamAudioSourceNode;
  private gainNode: GainNode;
  private analyserNode: AnalyserNode;
  private lastChangeTime: number = 0;
  private interval: number = 0;
  private on: boolean = true;

  constructor(stream: MediaStream) {
    this.audio.srcObject = stream;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.5;

    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;

    this.audio.onloadedmetadata = () => {
      this.sourceNode = this.audioContext.createMediaStreamSource(
        this.audio.srcObject as MediaStream,
      );
      this.audio.play();
      this.audio.muted = true;
      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      this.analyserNode.connect(this.audioContext.destination);
      this.gainNode.connect(this.analyserNode);
    };
  }

  // 볼륨 조절 메서드
  setVolume(volume: number) {
    this.gainNode.gain.value = volume;
  }

  onChangeSpeakVolume(interval: number, fn: (volume: number) => void) {
    this.interval = interval;

    const execute = (time: number = 0) => {
      if (time - this.lastChangeTime > this.interval) {
        this.lastChangeTime = time;
        const bufferLength = this.analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        // 분석기로부터 타임 도메인 데이터를 배열로 가져옴
        this.analyserNode.getByteTimeDomainData(dataArray);

        let max = 0;
        // 최대 진폭을 찾음
        for (let i = 0; i < bufferLength; i++) {
          const current = Math.abs((dataArray[i] - 128) / 128);
          if (current > max) {
            max = current;
          }
        }

        // 최대 진폭을 0에서 100 사이의 값으로 변환
        const volumeLevel = Math.floor(max * 100);

        fn(volumeLevel);
      }

      if (!this.on) return;
      requestAnimationFrame(execute);
    };

    execute();
  }

  // 오디오 처리 정지
  stopAudioProcessing() {
    this.sourceNode?.disconnect();
    this.gainNode.disconnect();
    this.analyserNode.disconnect();
    this.audioContext.close();

    this.on = false;

    this.audio.pause();
    // @ts-ignore
    const tracks = this.audio.srcObject?.getTracks();
    if (!tracks) return;
    tracks.forEach((track: any) => {
      track.stop();
    });
    this.audio.srcObject = null;
    this.audio.remove();
  }
}
