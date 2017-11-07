import clientCore = require('./lib/index');
import bwcErrors = require('./lib/errors');

export class Client {
  constructor() {
    clientCore.errors = bwcErrors;
  }
}


// Errors thrown by the library
