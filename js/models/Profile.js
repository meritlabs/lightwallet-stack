'use strict';
var preconditions = require('preconditions').singleton();
var _ = require('underscore');
var log = require('../log');
var bitcore = require('bitcore');

function Profile(info, password, storage) {
  preconditions.checkArgument(info.email);
  preconditions.checkArgument(password);
  preconditions.checkArgument(storage);
  preconditions.checkArgument(storage.getItem);

  this.email = info.email;
  this.extra = info.extra;
  this.hash = Profile.hash(this.email, password);
  this.storage = storage;
};

Profile.hash = function(email, password) {
  return bitcore.util.sha256ripe160(email + password).toString('hex');
};

Profile.fromObj = function(obj, password, storage) {
  var o = _.clone(obj);
  return new Profile(obj, password, storage);
};


Profile.prototype.key = function() {
  return 'identity::' + this.hash + '_' + this.email;
};

Profile.prototype.toObj = function() {
  var obj = _.clone(this);
  delete obj['hash'];
  return JSON.parse(JSON.stringify(obj));
};

Profile.open = function(storage, cb) {
  var key = this.key();
  this.storage.getGlobal(key, function(err, val) {
    if (!val) return cb(new Error('PNOTFOUND: Profile not found'));
    return cb(Profile.fromObj(val, password, storage));
  });
};

Profile.prototype.store = function(opts, cb) {
  var self = this;
  var val = self.toObj();
  var key = self.key();

  self.storage.get(key, function(val2) {
    if (val2 && !opts.overwrite) {
      if (cb)
        return cb(new Error('PEXISTS: Profile already exist'))
    } else {
      self.storage.set(key, val, function(err) {
        log.debug('Identity stored');
        if (cb)
          cb(err);
      });
    }
  });
};

module.exports = Profile;
