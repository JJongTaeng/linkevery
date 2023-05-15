import { HandlerMap, ROOM_MESSAGE_ID } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { updateMemberByDB } from '../../store/thunk/roomThunk';
import { Message } from '../db/LinkeveryDB';
import { query } from '../db/Query';
import { storage } from '../storage/StorageService';
import { utils } from '../utils/Utils';

export const roomHandlers: HandlerMap<ROOM_MESSAGE_ID> = {
  [ROOM_MESSAGE_ID.MEMBER_NAME_PRE]: (protocol, { dispatch, rtcManager }) => {
    const username = storage.getItem('username');
    const userKey = storage.getItem('userKey');
    dispatch.sendMemberNameMessage({ username, to: protocol.from, userKey });
  },
  [ROOM_MESSAGE_ID.MEMBER_NAME]: (protocol, { dispatch, rtcManager }) => {
    const { username, userKey, roomName } = storage.getAll();

    store.dispatch(
      roomActions.updateMember({
        username: protocol.data.username,
        clientId: protocol.from,
        userKey: protocol.data.userKey,
      }),
    );

    store.dispatch(
      updateMemberByDB({ roomName, member: store.getState().room.room.member }),
    );
    dispatch.sendMemberNameOkMessage({
      username,
      to: protocol.from,
      userKey,
    });
  },
  [ROOM_MESSAGE_ID.MEMBER_NAME_POST]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const roomName = storage.getItem('roomName');

    store.dispatch(
      roomActions.updateMember({
        username: protocol.data.username,
        clientId: protocol.from,
        userKey: protocol.data.userKey,
      }),
    );

    store.dispatch(
      updateMemberByDB({ roomName, member: store.getState().room.room.member }),
    );

    const messageList = await query.getMessageList(roomName);

    dispatch.sendSyncChatListMessage({
      messageList,
    });
  },
  [ROOM_MESSAGE_ID.SYNC_CHAT_LIST]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const roomName = storage.getItem('roomName');

    const { messageList } = protocol.data;

    if (messageList.length) {
      await query.addMessageList(
        messageList.map((message: Message) => ({
          message: message.message,
          date: message.date,
          messageKey: message.messageKey,
          userKey: message.userKey,
          username: message.username,
          roomName: message.roomName,
          messageType: message.messageType,
        })),
      );
    }

    const myMessageList = await query.getMessageList(roomName);
    dispatch.sendSyncChatListOkMessage({
      messageList: myMessageList,
    });
  },
  [ROOM_MESSAGE_ID.SYNC_CHAT_LIST_OK]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const roomName = storage.getItem('roomName');

    const { messageList } = protocol.data;
    const myMessageList = await query.getMessageList(roomName);

    const diffMessageList = utils.diffTwoArray(
      messageList,
      myMessageList,
      'messageKey',
    );

    if (messageList.length) {
      await query.addMessageList(
        messageList.map((message: Message) => ({
          message: message.message,
          date: message.date,
          messageKey: message.messageKey,
          userKey: message.userKey,
          username: message.username,
          roomName: message.roomName,
          messageType: message.messageType,
        })),
      );
    }
  },
};
