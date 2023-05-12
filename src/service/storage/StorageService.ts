interface StorageData {
  clientId: string;
  username: string;
  roomName: string;
  userKey: string;
}

type Key = keyof StorageData;

const APP = 'APP';

export class StorageService {
  private storage: StorageData = {
    clientId: '',
    roomName: '',
    username: '',
    userKey: '',
  };

  constructor() {
    this.load();
  }

  public getItem(key: Key) {
    this.load();
    return this.storage[key];
  }

  public getAll() {
    this.load();
    return this.storage;
  }

  public setItem(key: Key, value: StorageData[Key]) {
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
