import { InjectionToken } from '@angular/core';
import { Promise } from 'bluebird';


export interface MeritStorage {
  get(k: string): Promise<any>;
  set(k: string, v: any): Promise<void>;
  remove(k: string): Promise<void>;
  create(k: string, v: any): Promise<void>;
}

export class KeyAlreadyExistsError extends Error {
  constructor() {
    super('Key already exists');
  }
}

export let MERITSTORAGE = new InjectionToken<MeritStorage>('storage');
