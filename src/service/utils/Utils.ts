import { store } from '../../store/store';

class Utils {
  isBottomScrollElement(element: HTMLElement) {
    return (
      element.scrollHeight - element.getBoundingClientRect().height <
      element.scrollTop + 200
    );
  }
  getUserKeyByClientId(clientId: string) {
    const member = store.getState().room.room.member;

    for (const key in member) {
      if (member[key].clientId === clientId) {
        return key;
      }
    }
  }
}

export const utils = new Utils();
