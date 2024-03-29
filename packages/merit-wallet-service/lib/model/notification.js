var _ = require('lodash');
var Uuid = require('uuid');

/*
 * notifications examples
 *
 * NewCopayer -
 * NewAddress -
 * NewTxProposal - (amount)
 * TxProposalAcceptedBy - (txProposalId, copayerId)
 * TxProposalRejectedBy -  (txProposalId, copayerId)
 * txProposalFinallyRejected - txProposalId
 * txProposalFinallyAccepted - txProposalId
 *
 * IncomingTx (address, txid)
 * OutgoingTx - (txProposalId, txid)
 *
 * data Examples:
 * { amount: 'xxx', address: 'xxx'}
 * { txProposalId: 'xxx', copayerId: 'xxx' }
 *
 * Data is meant to provide only the needed information
 * to notify the user
 *
 */
function Notification() {}

Notification.create = function(opts) {
  opts = opts || {};

  var x = new Notification();

  x.version = '1.0.0';
  var now = Date.now();

  x.createdOn = Math.floor(now / 1000);
  x.id = _.padStart(now, 14, '0') + _.padStart(opts.ticker || 0, 4, '0');
  x.type = opts.type || 'general';
  x.data = opts.data;
  x.walletId = opts.walletId;
  x.creatorId = opts.creatorId;
  x.lockedForPushNotifications = false;
  x.lockedForEmailNotifications = false;

  return x;
};

Notification.fromObj = function(obj) {
  var x = new Notification();

  x.version = obj.version;
  x.createdOn = obj.createdOn;
  x.id = obj.id;
  (x.type = obj.type), (x.data = obj.data);
  x.walletId = obj.walletId;
  x.creatorId = obj.creatorId;
  x.lockedForPushNotifications = obj.lockedForPushNotifications ? obj.lockedForPushNotifications : false;
  x.lockedForEmailNotifications = obj.lockedForEmailNotifications ? x.lockedForEmailNotifications : false;

  return x;
};

Notification.prototype.lockForPushNotifications = function() {
  this.lockedForPushNotifications = true;
};

Notification.prototype.lockForEmailNotifications = function() {
  this.lockedForEmailNotifications = true;
};

module.exports = Notification;
