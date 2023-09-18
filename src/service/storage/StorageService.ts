import { injectable } from 'tsyringe';

interface StorageData {
  clientId: string;
  username: string;
  roomName: string;
  userKey: string;
  voiceStatus: boolean;
}

type Key = keyof StorageData;

const APP = 'APP';

@injectable()
export class StorageService {
  private storage: StorageData = {
    clientId: '',
    roomName: '',
    username: '',
    userKey: '',
    voiceStatus: false,
  };

  constructor() {
    this.load();
  }

  public getItem<T extends Key>(key: T): StorageData[T] {
    this.load();
    return this.storage[key];
  }

  public getAll() {
    this.load();
    return this.storage;
  }

  public setItem<T extends Key>(key: T, value: StorageData[T]) {
    this.storage[key] = value;
    this.save();
  }

  public hasItem(key: Key) {
    return !!this.storage[key];
  }

  public save() {
    const stringify = JSON.stringify(this.storage);
    sessionStorage.setItem(APP, stringify);
  }

  public load() {
    const storage = sessionStorage.getItem(APP);
    this.storage = JSON.parse(storage ?? JSON.stringify(this.storage));
  }
}

export const storage = new StorageService();
