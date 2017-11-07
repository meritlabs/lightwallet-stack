import { MeritClient } from './lib/index';
import bwcErrors = require('./lib/errors');

export class Client extends MeritClient {
  public errors;
  constructor(opts:any = {}) {
    super({opts});
    this.errors = bwcErrors;
  }
}


// Errors thrown by the library
