export type ChatMessageType = 'text' | 'image' | 'pdf' | 'file' | 'url';

export interface ChatUtilsService {
  getChatType(message: string): ChatMessageType;

  getUrlInMessage(message: string): string;
}
