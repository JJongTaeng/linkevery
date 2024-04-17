import { AudioPlayer } from 'service/media/AudioPlayer.ts';
import { singleton } from 'tsyringe';

@singleton()
export class AudioPlayerManager {
  audioStreamMap: Map<string, AudioPlayer> = new Map();

  addAudioStream(clientId: string, stream: MediaStream) {
    this.audioStreamMap.set(clientId, new AudioPlayer(stream));
  }

  removeAudioStream(clientId: string) {
    const audioStream = this.audioStreamMap.get(clientId);
    audioStream?.stopAudioProcessing();

    this.audioStreamMap.delete(clientId);
  }

  clear() {
    for (const [key, value] of this.audioStreamMap) {
      value.stopAudioProcessing();
      this.audioStreamMap.delete(key);
    }
  }

  setVolume(id: string, volume: number) {
    let audioStream = this.audioStreamMap.get(id);
    audioStream?.setVolume(volume);
  }
}
