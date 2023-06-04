import { useRef } from 'react';
import { useSlice } from '../useSlice';

type RoomState = typeof initialState;
type RoomAction = {
  type: string;
  payload: Partial<RoomState>;
};

const initialState = {
  usernameModalVisible: false,
  isFullScreen: false,
  page: 0,
  isVisibleScrollButton: false,
};

const actions = {
  setIsFullScreen: (state: RoomState, action: RoomAction) => ({
    ...state,
    isFullScreen: action.payload.isFullScreen ?? false,
  }),
  setIsVisibleScrollButton: (state: RoomState, action: RoomAction) => ({
    ...state,
    isVisibleScrollButton: action.payload.isVisibleScrollButton ?? false,
  }),
  setPage: (state: RoomState, action: RoomAction) => ({
    ...state,
    page: action.payload.page ?? 0,
  }),
  setUsernameModalVisible: (state: RoomState, action: RoomAction) => ({
    ...state,
    usernameModalVisible: action.payload.usernameModalVisible ?? false,
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
    elements: {
      chatListElement,
      chatLoadingTriggerElement,
      focusInput,
    },
  };
}
