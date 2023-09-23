export class ChatUtils {
  URL_REGEX = /(http[s]?:\/\/)?([^\/\s]+\/)([^\s]*)/g;

  getUrlInMessage(message: string): string {
    return message.match(this.URL_REGEX)?.[0] ?? '';
  }
}

export const chatUtils = new ChatUtils();
