import { store } from 'store/store';

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

  arrayBufferToString(buffer: ArrayBuffer) {
    return new TextDecoder('utf-8').decode(buffer);
  }
  stringToArrayBuffer(str: string) {
    return new TextEncoder().encode(str).buffer;
  }

  sliceString(str: string, length: number) {
    let arr = [];
    for (let i = 0; i < str.length; i += length) {
      arr.push(str.slice(i, i + length));
    }
    return arr;
  }
  sum(arr: number[]) {
    return arr.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }
  convertFilesToDataUrls(fileList: File[]): Promise<any[]> {
    let promises = fileList.map((file) => {
      // 각 파일에 대해 Promise 생성
      return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onloadend = () => resolve(reader.result); // 파일 읽기가 끝나면 resolve
        reader.onerror = reject; // 에러 발생 시 reject

        reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기 시작
      });
    });

    return Promise.all(promises); // 모든 Promise가 완료될 때까지 기다림
  }
}

export const utils = new Utils();
