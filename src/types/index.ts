export interface ChatType {
  message: string;
  userKey: string;
  date: string;
  username: string;
}

export type SendChatType = Omit<ChatType, 'username'>;

export interface ReducerActionType<T, S> {
  type: T;
  payload: Partial<S>;
}
export interface Event<T = EventTarget> {
  target: T;
}
