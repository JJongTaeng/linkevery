import { store } from '../../store/store';

class Utils {
  isBottomScrollElement(element: HTMLElement) {
    return (
      element.scrollHeight - element.getBoundingClientRect().height <
      element.scrollTop + 1
    );
  }
  getUserKeyByClientId(clientId: string) {
    const member = store.getState().room.current.member;

    for (const key in member) {
      if (member[key].clientId === clientId) {
        return key;
      }
    }
  }
  removeDuplicateItem(arr: { [key: string]: any }[], key: string) {
    const set = new Set();
    const uniqueArr: any[] = [];
    arr.forEach((item) => {
      const duplicate = set.has(item[key]);
      set.add(item[key]);
      if (duplicate) {
      } else {
      }
    });

    return uniqueArr;
  }

  diffTwoArray(arr1: any[], arr2: any[], key: string) {
    return arr1.filter((item1: any) => {
      const duplicate = arr2.filter(
        (item2) => item2[key] === item1[key],
      ).length;
      return !duplicate;
    });
  }
}

export const utils = new Utils();
