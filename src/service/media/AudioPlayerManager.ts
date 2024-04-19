import { singleton } from 'tsyringe';
import { utils } from 'service/utils/Utils.ts';

@singleton()
export class AudioPlayerManager {
  async addAudioStream(clientId: string, stream: MediaStream) {
    const find = document.getElementById(
      utils.getUsernameByClientId(clientId) || '',
    )! as HTMLAudioElement;
    if (find) {
      find.pause();
      find.parentNode?.removeChild(find);
    }
    const audio = document.createElement('audio');
    audio.setAttribute('id', utils.getUsernameByClientId(clientId) || '');
    audio.classList.add('voice-audio');
    audio.srcObject = stream;
    document.body.appendChild(audio);
    await audio.play();
  }

  removeAudioStream(clientId: string) {
    const audio = document.getElementById(
      utils.getUsernameByClientId(clientId) || '',
    );
    if (!audio) return;
    audio.parentNode?.removeChild(audio);
  }

  clear() {
    const audioNodeList = document.querySelectorAll('.voice-audio');
    audioNodeList.forEach((node) => {
      node.parentNode?.removeChild(node);
    });
  }

  setVolume(clientId: string, volume: number) {
    const audio = document.getElementById(
      utils.getUsernameByClientId(clientId) || '',
    )! as HTMLAudioElement;
    audio.volume = volume;
  }
}
