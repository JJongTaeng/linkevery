import { ChatMessageType, ChatUtilsService } from './ChatUtilsService';

export class ChatUtils implements ChatUtilsService {
  URL_REGEX = /(http[s]?:\/\/)?([^\/\s]+\/)([^\s]*)/g;

  getChatType(message: string): ChatMessageType {
    if (!!message.match('data:image/')) {
      return 'image';
    } else if (!!message.match(this.URL_REGEX)) {
      return 'url';
    }

    return 'text';
  }

  getUrlInMessage(message: string): string {
    return message.match(this.URL_REGEX)?.[0] ?? '';
  }
}

export const chatUtils = new ChatUtils();
