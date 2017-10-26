import { MeritStorage, KeyAlreadyExistsError } from 'merit/core/storage/storage.interface';
import { Logger } from 'merit/core/logger';

export class RamStorage implements MeritStorage {
  hash = {};

  constructor(private log: Logger) { }

  get(k: string): Promise<any> {
    return Promise.resolve(this.hash[k]);
  };
  set(k: string, v: any): Promise<void> {
    return new Promise<void>(resolve => {
      this.hash[k] = v;
      resolve();
    });
  };
  remove(k: string): Promise<void> {
    return new Promise<void>(resolve => {
      delete this.hash[k];
      resolve();
    });
  };
  create(k: string, v: any): Promise<void> {
    return this.get(k).then((data) => {
      if (data) throw new KeyAlreadyExistsError();
      this.set(k, v);
    });
  };
}
