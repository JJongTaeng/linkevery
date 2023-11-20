import { CATEGORY, ROOM_MESSAGE_ID } from '../../constants/eventType';
import { inject, injectable } from 'tsyringe';
import { storage } from '../storage/StorageService';
import { store } from '../../store/store';
import { roomActions } from '../../store/features/roomSlice';
import { userActions } from '../../store/features/userSlice';
import { ConnectionEmitter } from '../emitter/ConnectionEmitter';
import { RTCManager } from '../rtc/RTCManager';
import { RTCManagerService } from '../rtc/RTCManagerService';
import { VoiceEmitter } from '../emitter/VoiceEmitter';
import { AudioManager } from '../media/AudioManager';
import { chatActions } from '../../store/features/chatSlice';
import { statusActions } from '../../store/features/statusSlice';
import { addRoomByDB } from '../../store/thunk/roomThunk';
import { category } from '../../decorators/category';
import { messageId } from '../../decorators/messageId';

@category(CATEGORY.ROOM)
@injectable()
export class RoomHandler {
  constructor(
    @inject(ConnectionEmitter)
    private connectionPeerEmitter: ConnectionEmitter,
    @inject(RTCManager) private rtcManager: RTCManagerService,
    @inject(VoiceEmitter) private voicePeerEmitter: VoiceEmitter,
    @inject(AudioManager) private audioManager: AudioManager,
  ) {}
  @messageId(ROOM_MESSAGE_ID.LEAVE)
  leave() {
    const roomName = storage.getItem('roomName');
    const userKey = storage.getItem('userKey');

    store.dispatch(roomActions.leaveRoom());
    store.dispatch(userActions.changeVoiceStatus(false));
    store.dispatch(userActions.changeScreenShareStatus(false));
    store.dispatch(chatActions.resetChatState());
    store.dispatch(statusActions.resetAllStatusState());

    this.connectionPeerEmitter.sendConnectionDisconnectMessage({ roomName });
    this.voicePeerEmitter.sendVoiceDisconnectMessage({ userKey });
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
    this.connectionPeerEmitter.sendConnectionConnectMessage({}); // socket join
    this.connectionPeerEmitter.sendConnectionJoinRoomMessage({
      roomName,
      userKey,
    }); // join
    store.dispatch(roomActions.setRoomName(roomName));
  }
}
