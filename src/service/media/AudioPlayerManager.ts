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
    audio.controls = import.meta.env.DEV;
    document.body.appendChild(audio);
    await audio.play();
    audio.addEventListener('volumechange', () => {
      console.log(utils.getUsernameByClientId(clientId), audio.volume);
    });
  }

  removeAudioStream(clientId: string) {
    const audio = document.getElementById(
      utils.getUsernameByClientId(clientId) || '',
    ) as HTMLAudioElement;
    if (!audio) return;
    // @ts-ignore
    audio.srcObject.getTracks().forEach((track: MediaStreamTrack) => {
      console.log(track);
      track.stop();
    });
    audio.srcObject = null;
    audio.remove();
  }

  clear() {
    const audioNodeList = document.querySelectorAll('.voice-audio');
    audioNodeList.forEach((audio) => {
      // @ts-ignore
      audio.srcObject.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });

      // @ts-ignore
      audio.srcObject = null;
      audio.remove();
    });
  }

  setVolume(clientId: string, volume: number) {
    const audio = document.getElementById(
      utils.getUsernameByClientId(clientId) || '',
    )! as HTMLAudioElement;
    audio.volume = volume;
  }
}
