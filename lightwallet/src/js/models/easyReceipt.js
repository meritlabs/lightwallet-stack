'use strict';

/**
 * EasyReceipt
 * An object that stores the incoming params for receiving an EasySend transaction.
 * Designed to be persisted to LocalStorage between openings/closings of application.
 * 
 * FIELDS:
 * createdOn - Timestamp
 * amount - Amount in Micro
 * senderName - First name of the sender, for convenience.
 * inviteCode - InviteCode from the sender.  Used if user signs up.
 * secret - Password used as one of 
 */

function EasyReceipt() {
  this.version = '1.0.0';
}

EasyReceipt.create = function (opts) {
  opts = opts || {};

  var receipt = new EasyReceipt();
  receipt.createdOn = Date.now();
  receipt.active = true;
  
  return receipt;
};

EasyReceipt.fromObj = function(obj) {
  var receipt = new EasyReceipt();

  receipt.createdOn = obj.createdOn || Date.now();
  receipt.amount = obj.amount; 
  receipt.senderName = obj.senderName;
  receipt.inviteCode = obj.inviteCode;
  receipt.secret = obj.secret;
  obj.sentToAddress = obj.sentToAddress;

  return receipt;
};

EasyReceipt.prototype.toObj = function() {
  return JSON.stringify(this);
};

EasyReceipt.prototype.isValid = function() {
  // An easyReceip must have an amount, a secret, and an inviteCode
  // TODO: Actually validate that these are in the right format
  return (this.unlockCode && this.senderPublicKey && this.secret && this.blockTimeout);
};

EasyReceipt.fromString = function(str) {
  return EasyReceipt.fromObj(JSON.parse(str));
};

