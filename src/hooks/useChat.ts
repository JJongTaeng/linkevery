import cloneDeep from 'clone-deep';
import { useEffect, useRef, useState } from 'react';
import { APP_SERVICE_EVENT_NAME } from '../constants/appEvent';
import { AppServiceImpl } from '../service/app/AppServiceImpl';
import { ChatType } from '../types';

export const useChat = () => {
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const { dispatch, ee } = useRef(AppServiceImpl.getInstance()).current;

  const handleChat = ({ message, clientId, date, username }: ChatType) => {
    const list = cloneDeep(chatList);
    list.push({ message, clientId, date, username });
    setChatList(list);
  };

  useEffect(() => {
    ee.on(APP_SERVICE_EVENT_NAME.CHAT_MESSAGE, handleChat);
  }, [chatList]);

  return {
    chatList,
    sendChat: ({ message, clientId, date, username }: ChatType) => {
      dispatch.sendChatMessage({ message, peerId: clientId, date, username });
      handleChat({ message, clientId, date, username });
    },
  };
};
