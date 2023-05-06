class AudioManager {
  private audioMap: { [key: string]: HTMLAudioElement } = {};
  constructor() {}

  public addAudio(id: string, mediaStream: MediaStream) {
    const audio = new Audio();
    audio.srcObject = mediaStream;
    audio.volume = 0.5;
    this.audioMap[id] = audio;

    audio.play();
  }

  public removeAudio(id: string) {
    const audio = this.audioMap[id];
    if (!audio) return;

    //@ts-ignore
    const tracks = audio.srcObject?.getTracks();
    if (!tracks) return;
    tracks.forEach((track: any) => {
      track.stop();
    });

    delete this.audioMap[id];
  }

  public removeAllAudio() {
    for (const key in this.audioMap) {
      this.removeAudio(key);
    }
  }

  public changeVolume(id: string, volume: number) {
    const audio = this.audioMap[id];
    audio.volume = volume;
  }
}
export const audioManager = new AudioManager();
