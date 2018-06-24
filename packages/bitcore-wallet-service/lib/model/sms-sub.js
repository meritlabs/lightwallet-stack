'use strict';

function SmsSub() {}

SmsSub.create = function(opts) {
  opts = opts || {};

  const sub = new SmsSub();
  sub.createdOn = Math.floor(Date.now() / 1000);
  sub.walletId = opts.walletId;
  sub.phoneNumber = opts.phoneNumber;
  sub.settings = opts.settings;
  return sub;
};

SmsSub.fromObj = function(opts) {
  opts = opts || {};

  const sub = new SmsSub();
  sub.createdOn = opts.createdOn;
  sub.walletId = opts.walletId;
  sub.phoneNumber = opts.phoneNumber;
  sub.settings = opts.settings;
  return sub;
};

module.exports = SmsSub;
