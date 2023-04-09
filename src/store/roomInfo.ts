import { StorageService } from './../service/storage/StorageService';
import { atom } from 'recoil';

const storage = StorageService.getInstance();

export const usernameAtom = atom({
  key: 'usernameAtom',
  default: storage.getItem('username') || '',
});
