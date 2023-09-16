import dayjs from 'dayjs';
import { useRef } from 'react';
import { debounce } from 'throttle-debounce';
import { storage } from 'service/storage/StorageService';
import { utils } from 'service/utils/Utils';
import { chatActions } from 'store/features/chatSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { addChatByDB } from 'store/thunk/chatThunk';
import { useSlice } from 'hooks/useSlice';
import { useApp } from 'hooks/useApp';

type ChatState = typeof initialState;
type ChatAction = {
  type: string;
  payload: Partial<ChatState>;
};

type Actions = Record<
  string,
  (state: ChatState, action: ChatAction) => ChatState
>;

const initialState = {
  page: 0,
  isVisibleScrollButton: false,
  chatMessage: '',
  isShiftKeyDowned: false,
};

const actions: Actions = {
  setIsVisibleScrollButton: (state, action) => ({
    ...state,
    isVisibleScrollButton: action.payload.isVisibleScrollButton ?? false,
  }),
  setPage: (state, action) => ({
    ...state,
    page: action.payload.page ?? 0,
  }),
  setChatMessage: (state, action) => ({
    ...state,
    chatMessage: action.payload.chatMessage ?? '',
  }),
  setIsShiftKeyDowned: (state, action) => ({
    ...state,
    isShiftKeyDowned: action.payload.isShiftKeyDowned ?? false,
  }),
};

export function useChat() {
  const [app] = useApp();
  const [state, dispatch] = useSlice<ChatState, keyof typeof actions>(
    actions,
    initialState,
  );

  const chatListElement = useRef<HTMLDivElement>(null);
  const chatLoadingTriggerElement = useRef<HTMLDivElement>(null);
  const focusInput = useRef<HTMLInputElement>(null);

  const { username } = useAppSelector((state) => ({
    username: state.user.username,
  }));
  const storeDispatch = useAppDispatch();
  const sendChatMessage = (type = 'text', image?: string) => {
    if (type === 'text' && !state.chatMessage) return;
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
    const message: any = {
      image: image,
      text: state.chatMessage,
    };
    const messageProtocol = {
      messageType: type,
      messageKey: username + '+' + date,
      message: message[type],
      userKey: storage.getItem('userKey'),
      date,
      username,
    };

    app.dispatch.sendChatSendMessage(messageProtocol); // send
    storeDispatch(chatActions.addChat(messageProtocol)); // store add

    // db add
    storeDispatch(
      addChatByDB({
        ...messageProtocol,
        roomName: storage.getItem('roomName'),
      }),
    );

    dispatch.setChatMessage({ chatMessage: '' });
  };

  const handleVisibleScrollButton = debounce(200, () => {
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      dispatch.setIsVisibleScrollButton({ isVisibleScrollButton: false });
    } else {
      dispatch.setIsVisibleScrollButton({ isVisibleScrollButton: true });
    }
  });

  const moveToChatScrollBottom = () => {
    setTimeout(() => {
      if (chatListElement.current)
        chatListElement.current.scrollTop =
          chatListElement?.current?.scrollHeight;
    }, 0);
  };

  const handleChatKeydown = (e: any) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (state.isShiftKeyDowned) {
          dispatch.setChatMessage({ chatMessage: state.chatMessage + '\n' });
          return;
        }
        if (e.nativeEvent.isComposing) return;
        sendChatMessage();
        e.target.value = '';
        focusInput?.current?.focus();
        e.target.focus();
        break;
      case 'Shift':
        dispatch.setIsShiftKeyDowned({ isShiftKeyDowned: true });
        break;
    }
  };

  const handleChatKeyup = (e: any) => {
    switch (e.key) {
      case 'Shift':
        dispatch.setIsShiftKeyDowned({ isShiftKeyDowned: false });
        break;
    }
  };

  const handleChatSubmit = (e?: any, type = 'text') => {
    e?.preventDefault();
    sendChatMessage(type);

    focusInput?.current?.focus();
    e && e.target.message.focus();
  };

  return {
    state,
    sendChatMessage,

    setPage: (page: number) => {
      dispatch.setPage({ page });
    },
    setChatMessage: (message: string) => {
      dispatch.setChatMessage({ chatMessage: message });
    },
    setIsShiftKeyDowned: (isKeyDowned: boolean) => {
      dispatch.setIsShiftKeyDowned({ isShiftKeyDowned: isKeyDowned });
    },
    handleVisibleScrollButton,
    handleChatKeydown,
    handleChatSubmit,
    handleChatKeyup,
    moveToChatScrollBottom,
    elements: {
      chatListElement,
      chatLoadingTriggerElement,
      focusInput,
    },
  };
}
