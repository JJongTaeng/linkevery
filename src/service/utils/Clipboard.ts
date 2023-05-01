import { message } from 'antd';

class Clipboard {
  constructor() {}

  updateClipboard(str: string) {
    navigator.clipboard.writeText(str).then(
      () => {
        message.info('URL이 복사되었습니다.');
      },
      () => {
        /* clipboard write failed */
      },
    );
  }
}

export const clipboard = new Clipboard();
