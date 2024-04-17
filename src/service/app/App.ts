import { RTCManager } from 'service/rtc/RTCManager';
import { storage } from 'service/storage/StorageService';
import { inject, singleton } from 'tsyringe';
import { RTCManagerService } from 'service/rtc/RTCManagerService';
import { ScreenShareEmitter } from '../emitter/ScreenShareEmitter';
import { VoiceEmitter } from '../emitter/VoiceEmitter';
import { AudioPlayerManager } from 'service/media/AudioPlayerManager.ts';

@singleton()
export class App {
  screenMediaStream?: MediaStream;

  constructor(
    @inject(ScreenShareEmitter)
    private screenSharePeerEmitter: ScreenShareEmitter,
    @inject(VoiceEmitter) private voicePeerEmitter: VoiceEmitter,
    @inject(RTCManager) private _rtcManager: RTCManagerService,
    @inject(AudioPlayerManager) private audioPlayerManager: AudioPlayerManager,
  ) {}

  get rtcManager() {
    return this._rtcManager;
  }

  public disconnectVoice() {
    const userKey = storage.getItem('userKey');

    this.voicePeerEmitter.sendVoiceDisconnectMessage({ userKey });
    this.rtcManager.clearAudioTrack();
    this.audioPlayerManager.clear();
    this.rtcManager.clearVideoTrack();
  }

  public closeScreenShare() {
    const userKey = storage.getItem('userKey');
    this.screenSharePeerEmitter.sendScreenDisconnectMessage({ userKey });
    this.rtcManager.clearVideoTrack();
    this.screenMediaStream = undefined;
  }
}
