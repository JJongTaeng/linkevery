export interface ChatType {
  message: string;
  clientId: string;
  date: string;
  username: string;
}

export type SendChatType = Omit<ChatType, 'username'>;
