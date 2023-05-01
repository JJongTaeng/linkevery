import {
  HandlerMap,
  RTC_MANAGER_TYPE,
  VOICE_MESSAGE_ID,
} from '../../constants/protocol';
import { store } from '../../store/store';
import { audioManager } from '../media/AudioManager';

export const voiceHandlers: HandlerMap<VOICE_MESSAGE_ID> = {
  [VOICE_MESSAGE_ID.DISCONNECT]: (protocol, { dispatch, rtcManagerMap }) => {
    const { from } = protocol;
    if (!store.getState().voice.status) {
      return;
    }
    rtcManagerMap[RTC_MANAGER_TYPE.RTC_VOICE].removePeer(from);
    audioManager.removeAudio(from);
  },
};
