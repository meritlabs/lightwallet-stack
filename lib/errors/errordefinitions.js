'use strict';

var _ = require('lodash');

var ClientError = require('./clienterror');

var errors = {
  INVALID_BACKUP: 'Invalid Backup',
  WALLET_DOES_NOT_EXISTS: 'Wallet does not exists. Need to recreate',
  MISSING_PRIVATE_KEY: 'Missing private keys to sign',
  ENCRYPTED_PRIVATE_KEY: 'Private Key is encrypted, cannot sign',
  SERVER_COMPROMISED: 'Server response could not be verifed',
};

var errorObjects = _.zipObject(_.map(errors, function(msg, code) {
  return [code, new ClientError(code, msg)];
}));

errorObjects.codes = _.mapValues(errors, function(v, k) {
  return k;
});

module.exports = errorObjects;
