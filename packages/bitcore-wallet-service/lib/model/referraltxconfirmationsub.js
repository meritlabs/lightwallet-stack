'use strict';

function ReferralTxConfirmationSub() {};

ReferralTxConfirmationSub.create = function (opts) {
  opts = opts || {};

  const rtx = new ReferralTxConfirmationSub();

  rtx.version = 1;
  rtx.createdOn = Math.floor(Date.now() / 1000);
  rtx.walletId = opts.walletId;
  rtx.copayerId = opts.copayerId;
  rtx.hashCode = opts.hashCode;
  rtx.isActive = true;

  return rtx;
};

ReferralTxConfirmationSub.fromObj = function (obj) {
  const rtx = new ReferralTxConfirmationSub();

  rtx.version = obj.version;
  rtx.createdOn = obj.createdOn;
  rtx.walletId = obj.walletId;
  rtx.copayerId = obj.copayerId;
  rtx.hashCode = obj.hashCode;
  rtx.isActive = obj.isActive;

  return rtx;
};

module.exports = ReferralTxConfirmationSub;
