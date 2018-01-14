import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Logger } from 'merit/core/logger';

import { KeyAlreadyExistsError, MeritStorage } from 'merit/core/storage/storage.interface';


@Injectable()
export class LocalStorage implements MeritStorage {
  ls: Storage;

  constructor(private log: Logger) {
    this.ls = (typeof window.localStorage !== 'undefined') ? window.localStorage : null;
    if (!this.ls) throw new Error('localstorage not available');
  }

  async get(k: string): Promise<any> {
    let v = this.ls.getItem(k);
    if (!v) return null;
    if (!_.isString(v)) return v;
    let parsed: any;
    try {
      parsed = JSON.parse(v);
    } catch (e) {
    }

    return parsed || v;
  }

  set(k: string, v: any): Promise<void> {
    return new Promise<void>(resolve => {
      if (_.isObject(v)) {
        v = JSON.stringify(v);
      }
      if (v && !_.isString(v)) {
        v = v.toString();
      }

      this.ls.setItem(k, v);
      resolve();
    });
  }

  remove(k: string): Promise<void> {
    return new Promise<void>(resolve => {
      this.ls.removeItem(k);
      resolve();
    });
  }

  create(k: string, v: any): Promise<void> {
    return this.get(k).then((data) => {
      if (data) throw new KeyAlreadyExistsError();
      this.set(k, v);
    });
  }
}
