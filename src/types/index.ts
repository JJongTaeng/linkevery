export interface ChatType {
  message: string;
  userKey: string;
  date: string;
  username: string;
}

export type SendChatType = Omit<ChatType, 'username'>;
