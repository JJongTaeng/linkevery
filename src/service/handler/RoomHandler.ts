import { CATEGORY, ROOM_MESSAGE_ID } from 'constants/eventType.ts';
import { inject, injectable } from 'tsyringe';
import { storage } from '../storage/StorageService';
import { store } from 'store/store.ts';
import { roomActions } from 'store/features/roomSlice.ts';
import { userActions } from 'store/features/userSlice.ts';
import { ConnectionEmitter } from '../emitter/ConnectionEmitter';
import { RTCManager } from '../rtc/RTCManager';
import { RTCManagerService } from '../rtc/RTCManagerService';
import { VoiceEmitter } from '../emitter/VoiceEmitter';
import { AudioManager } from '../media/AudioManager';
import { chatActions } from 'store/features/chatSlice.ts';
import { statusActions } from 'store/features/statusSlice.ts';
import { addRoomByDB } from 'store/thunk/roomThunk.ts';
import { category } from 'decorators/category.ts';
import { messageId } from 'decorators/messageId.ts';

@category(CATEGORY.ROOM)
@injectable()
export class RoomHandler {
  constructor(
    @inject(ConnectionEmitter)
    private connectionEmitter: ConnectionEmitter,
    @inject(RTCManager) private rtcManager: RTCManagerService,
    @inject(VoiceEmitter) private voicePeerEmitter: VoiceEmitter,
    @inject(AudioManager) private audioManager: AudioManager,
  ) {}

  @messageId(ROOM_MESSAGE_ID.LEAVE)
  leave() {
    const roomName = storage.getItem('roomName');
    const userKey = storage.getItem('userKey');

    storage.setItem('voiceStatus', false);
    store.dispatch(roomActions.leaveRoom());
    store.dispatch(userActions.changeVoiceStatus(false));
    store.dispatch(userActions.changeScreenShareStatus(false));
    store.dispatch(chatActions.resetChatState());
    store.dispatch(statusActions.resetAllStatusState());

    this.connectionEmitter.sendConnectionDisconnectMessage({ roomName });
    if (store.getState().user.voiceStatus) {
      this.voicePeerEmitter.sendVoiceDisconnectMessage({ userKey });
    }
    this.rtcManager.clearAudioTrack();
    this.audioManager.removeAllAudio();
    this.rtcManager.clearVideoTrack();
    this.rtcManager.clearPeerMap();
  }

  @messageId(ROOM_MESSAGE_ID.JOIN)
  joinRoom() {
    const roomName = storage.getItem('roomName');
    const userKey = storage.getItem('userKey');
    store.dispatch(addRoomByDB({ roomName, member: {} }));
    this.connectionEmitter.sendConnectionConnectMessage({}); // socket join
    this.connectionEmitter.sendConnectionJoinRoomMessage({
      roomName,
      userKey,
    }); // join
    store.dispatch(roomActions.setRoomName(roomName));
  }
}
