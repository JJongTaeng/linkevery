class AudioManager {
  constructor() {}

  addAudio(id: string, mediaStream: MediaStream) {
    const audio = document.createElement('audio');
    audio.setAttribute('id', id);
    audio.classList.add('voice-audio');
    audio.srcObject = mediaStream;
    document.body.appendChild(audio);
    audio.play();
  }

  removeAudio(id: string) {
    const audio = document.getElementById(id);
    if (!audio) return;
    audio.parentNode?.removeChild(audio);
  }

  clearAllAudio() {
    const audioNodeList = document.querySelectorAll('.voice-audio');
    audioNodeList.forEach((node) => {
      node.parentNode?.removeChild(node);
    });
  }
}

export const audioManager = new AudioManager();
