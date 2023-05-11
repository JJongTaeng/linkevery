import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './features/chatSlice';
import loadingReducer from './features/loadingSlice';
import roomReducer from './features/roomSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    room: roomReducer,
    chat: chatReducer,
    user: userReducer,
    loading: loadingReducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
