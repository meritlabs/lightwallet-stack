'use strict';

var _ = require('lodash');

var ClientError = require('./clienterror');

var errors = {
  INVALID_BACKUP: 'Invalid Backup',
  MISSING_ARGS_TO_RECOVER_WALLET: 'Missing arguments to recover wallet',
  MISSING_PRIVATE_KEY: 'Missing private keys to sign',
  ENCRYPTED_PRIVATE_KEY: 'Private Key is encrypted, cannot sign',
  SERVERCOMPROMISED: 'Server response could not be verifed. It could be compromised',
};

var errorObjects = _.zipObject(_.map(errors, function(msg, code) {
  return [code, new ClientError(code, msg)];
}));

errorObjects.codes = _.mapValues(errors, function(v, k) {
  return k;
});

module.exports = errorObjects;
