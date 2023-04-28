import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './features/chatSlice';
import roomReducer from './features/roomSlice';
import userInfoReducer from './features/userInfoSlice';

export const store = configureStore({
  reducer: {
    room: roomReducer,
    chat: chatReducer,
    userInfo: userInfoReducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
