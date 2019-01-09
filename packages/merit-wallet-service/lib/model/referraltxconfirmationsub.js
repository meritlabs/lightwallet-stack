'use strict';

function ReferralTxConfirmationSub() {}

ReferralTxConfirmationSub.create = function(opts) {
  opts = opts || {};

  const rtx = new ReferralTxConfirmationSub();

  rtx.version = 1;
  rtx.createdOn = Math.floor(Date.now() / 1000);
  rtx.walletId = opts.walletId;
  rtx.copayerId = opts.copayerId;
  rtx.codeHash = opts.codeHash;
  rtx.isActive = true;
  rtx.txHash = opts.txHash;

  return rtx;
};

ReferralTxConfirmationSub.fromObj = function(obj) {
  const rtx = new ReferralTxConfirmationSub();

  rtx.version = obj.version;
  rtx.createdOn = obj.createdOn;
  rtx.walletId = obj.walletId;
  rtx.copayerId = obj.copayerId;
  rtx.codeHash = obj.codeHash;
  rtx.isActive = obj.isActive;
  rtx.txHash = obj.txHash;

  return rtx;
};

module.exports = ReferralTxConfirmationSub;
