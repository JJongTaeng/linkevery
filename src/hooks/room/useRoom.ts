import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useRef } from 'react';
import { debounce } from 'throttle-debounce';
// import { App } from '../../service/app/App';
import { storage } from '../../service/storage/StorageService';
import { utils } from '../../service/utils/Utils';
import { chatActions } from '../../store/features/chatSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addChatByDB } from '../../store/thunk/chatThunk';
import { addUserByDB, getUserByDB } from '../../store/thunk/userThunk';
import { useSlice } from '../useSlice';
import { container } from 'tsyringe';
import { App } from '../../service/app/App';

const app = container.resolve(App);

type RoomState = typeof initialState;
type RoomAction = {
  type: string;
  payload: Partial<RoomState>;
};

type Actions = Record<
  string,
  (state: RoomState, action: RoomAction) => RoomState
>;

const initialState = {
  usernameModalVisible: false,
  isFullScreen: false,
  page: 0,
  isVisibleScrollButton: false,
  chatMessage: '',
  isShiftKeyDowned: false,
};

const actions: Actions = {
  setIsFullScreen: (state, action) => ({
    ...state,
    isFullScreen: action.payload.isFullScreen ?? false,
  }),
  setIsVisibleScrollButton: (state, action) => ({
    ...state,
    isVisibleScrollButton: action.payload.isVisibleScrollButton ?? false,
  }),
  setPage: (state, action) => ({
    ...state,
    page: action.payload.page ?? 0,
  }),
  setUsernameModalVisible: (state, action) => ({
    ...state,
    usernameModalVisible: action.payload.usernameModalVisible ?? false,
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

export function useRoom() {
  const [state, dispatch] = useSlice<RoomState, keyof typeof actions>(
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

  const handleViewportResize = debounce(
    50,
    (e: any) => {
      window.scrollTo(0, document.body.scrollHeight - e.target.height);
    },
    {},
  );

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

  const handleUsernameSubmit = (username: string) => {
    const key = nanoid();
    storeDispatch(addUserByDB({ username, key }));
    storeDispatch(getUserByDB());
    storage.setItem('userKey', key);
    storage.setItem('username', username);
    dispatch.setUsernameModalVisible({ usernameModalVisible: false });
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
    setIsFullScreen: (isFull: boolean) => {
      dispatch.setIsFullScreen({ isFullScreen: isFull });
    },
    setPage: (page: number) => {
      dispatch.setPage({ page });
    },
    setUsernameModalVisible: (visible: boolean) => {
      dispatch.setUsernameModalVisible({ usernameModalVisible: visible });
    },
    setChatMessage: (message: string) => {
      dispatch.setChatMessage({ chatMessage: message });
    },
    setIsShiftKeyDowned: (isKeyDowned: boolean) => {
      dispatch.setIsShiftKeyDowned({ isShiftKeyDowned: isKeyDowned });
    },
    handleVisibleScrollButton,
    handleViewportResize,
    handleChatKeydown,
    handleChatSubmit,
    handleUsernameSubmit,
    handleChatKeyup,
    moveToChatScrollBottom,
    elements: {
      chatListElement,
      chatLoadingTriggerElement,
      focusInput,
    },
  };
}
