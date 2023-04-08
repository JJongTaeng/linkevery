interface StorageData {
  clientId: string;
  username: string;
  roomName: string;
}

type Key = keyof StorageData;

const APP = 'APP';

export class StorageService {
  private static instance: StorageService;
  private storage: StorageData = {
    clientId: '',
    roomName: '',
    username: '',
  };

  private constructor() {
    this.load();
  }

  public static getInstance() {
    if (!StorageService.instance) {
      this.instance = new StorageService();
    }
    return this.instance;
  }

  public getItem(key: Key) {
    this.load();
    return this.storage[key];
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
