import { CHAT_MESSAGE_ID, HandlerMap } from '../../constants/protocol';
import { chatActions } from '../../store/features/chatSlice';
import { store } from '../../store/store';
import { soundEffect } from '../media/SoundEffect';

export const chatHandlers: HandlerMap<CHAT_MESSAGE_ID> = {
  [CHAT_MESSAGE_ID.SEND]: (protocol, { dispatch, rtcManager }) => {
    const { message, date, username } = protocol.data;
    store.dispatch(
      chatActions.receivedChat({
        message,
        clientId: protocol.from,
        date,
        username,
      }),
    );

    if (store.getState().room.isScrollButtonView) {
      soundEffect.receivedChat();
    }
  },
};
