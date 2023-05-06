class AudioManager {
  constructor() {}

  addAudio(id: string, mediaStream: MediaStream) {
    this.removeAudio(id);
    const audio = document.createElement('audio');
    audio.setAttribute('id', id + '_audio');
    audio.classList.add('voice-audio');
    audio.srcObject = mediaStream;
    document.body.appendChild(audio);
    audio.volume = 0.5;
    audio.play();
  }

  removeAudio(id: string) {
    const audio = document.getElementById(id + '_audio');
    if (!audio) return;
    audio.parentNode?.removeChild(audio);
  }

  changeVolume(id: string, value: number) {
    const audio = document.getElementById(id + '_audio') as HTMLAudioElement;
    if (!audio) return;
    audio.volume = value;
  }

  clearAllAudio() {
    const audioNodeList = document.querySelectorAll('.voice-audio');
    audioNodeList.forEach((node) => {
      node.parentNode?.removeChild(node);
    });
  }
}

export const audioManager = new AudioManager();
