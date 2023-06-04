import { useRef } from 'react';
import { useSlice } from '../useSlice';

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

  return {
    state,
    setIsFullScreen: (isFull: boolean) => {
      dispatch.setIsFullScreen({ isFullScreen: isFull });
    },
    setIsVisibleScrollButton: (visible: boolean) => {
      dispatch.setIsVisibleScrollButton({ isVisibleScrollButton: visible });
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
    elements: {
      chatListElement,
      chatLoadingTriggerElement,
      focusInput,
    },
  };
}
