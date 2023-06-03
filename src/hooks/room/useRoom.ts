import { useReducer } from 'react';
import { ReducerActionType } from '../../types';

type RoomState = typeof initialState;

enum ROOM_ACTIONS {
  SET_USER_NAME_MODAL_VISIBLE = 'ROOM/SET_USER_NAME_MODAL_VISIBLE',
  SET_IS_FULL_SCREEN = 'ROOM/SET_IS_FULL_SCREEN',
  SET_PAGE = 'ROOM/SET_PAGE',
  SET_IS_VISIBLE_SCROLL_BUTTON = 'ROOM/SET_IS_VISIBLE_SCROLL_BUTTON',
}

function actionCreator<T, S>(type: T) {
  return (payload: Partial<S>) => {
    return {
      type,
      payload,
    };
  };
}

const setIsFullScreenAction = actionCreator<ROOM_ACTIONS, RoomState>(
  ROOM_ACTIONS.SET_IS_FULL_SCREEN,
);
const setUsernameModalVisibleAction = actionCreator<ROOM_ACTIONS, RoomState>(
  ROOM_ACTIONS.SET_USER_NAME_MODAL_VISIBLE,
);
const setPageAction = actionCreator<ROOM_ACTIONS, RoomState>(
  ROOM_ACTIONS.SET_PAGE,
);
const setIsVisibleScrollButtonAction = actionCreator<ROOM_ACTIONS, RoomState>(
  ROOM_ACTIONS.SET_IS_VISIBLE_SCROLL_BUTTON,
);

const initialState = {
  usernameModalVisible: false,
  isFullScreen: false,
  page: 0,
  isVisibleScrollButton: false,
};

const reducer = (
  state: RoomState,
  action: ReducerActionType<ROOM_ACTIONS, RoomState>,
): RoomState => {
  switch (action.type) {
    case ROOM_ACTIONS.SET_IS_FULL_SCREEN:
      return {
        ...state,
        isFullScreen: action.payload.isFullScreen ?? false,
      };
    case ROOM_ACTIONS.SET_IS_VISIBLE_SCROLL_BUTTON:
      return {
        ...state,
        isVisibleScrollButton: action.payload.isVisibleScrollButton ?? false,
      };
    case ROOM_ACTIONS.SET_USER_NAME_MODAL_VISIBLE:
      return {
        ...state,
        usernameModalVisible: action.payload.usernameModalVisible ?? false,
      };
    case ROOM_ACTIONS.SET_PAGE:
      return {
        ...state,
        page: action.payload.page ?? 0,
      };
    default:
      return initialState;
  }
};

export function useRoom() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    state,
    setIsFullScreen: (isFull: boolean) => {
      dispatch(setIsFullScreenAction({ isFullScreen: isFull }));
    },
    setIsVisibleScrollButton: (visible: boolean) => {
      dispatch(
        setIsVisibleScrollButtonAction({ isVisibleScrollButton: visible }),
      );
    },
    setPage: (page: number) => {
      dispatch(setPageAction({ page }));
    },
    setUsernameModalVisible: (visible: boolean) => {
      dispatch(
        setUsernameModalVisibleAction({ usernameModalVisible: visible }),
      );
    },
  };
}
