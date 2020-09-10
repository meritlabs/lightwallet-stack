const request = require('request');
const MessageBroker = require('./messagebroker');
const Storage = require('./storage');
const _ = require('lodash');

const notificationsToSend = [
  'IncomingTx',
  'IncomingInvite',
  'WalletUnlocked',
  'IncomingInviteRequest',
  'MiningReward',
  'GrowthReward',
  'MinedInvite',
];

function SmsNotificationService(opts) {
  console.log('[SMS Service] Starting...');
  this.messageBroker = opts.messageBroker || new MessageBroker(opts.messageBrokerOpts);
  this.messageBroker.onMessage(this.sendSMS.bind(this));
  this.notificationsServiceUrl = opts.meritMessagingUrl;

  if (opts.storage) {
    this.storage = opts.storage;
  } else {
    this.storage = new Storage();
    this.storage.connect(
      opts.storageOpts,
      () => {},
    );
  }

  console.log('[SMS Service] Started!');
}

SmsNotificationService.prototype.sendSMS = function(notification, cb) {
  cb = cb || (() => {});
  return cb(); // IGNORE THE SERVICE COMPLETELY FOR NOW

  if (notificationsToSend.indexOf(notification.type) === -1) return cb();

  this.storage.fetchSmsNotificationSub(notification.walletId, (err, recipient) => {
    if (err || !recipient) {
      return cb(err);
    }

    if (recipient.settings && !recipient.settings[notification.type]) {
      return cb();
    }

    console.log('[SMS Service] Sending SMS notification', notification, recipient);

    const { amount, isInvite } = notification.data;

    request(
      {
        method: 'POST',
        uri: this.notificationsServiceUrl + '/notification',
        json: {
          type: 'sms',
          destination: recipient.phoneNumber,
          id: notification.id,
          template: _.snakeCase(notification.type),
          language: 'en',
          notification: {
            amount: isInvite ? String(amount) : amount / 1e8 + 'MRT',
          },
        },
      },
      (err, response) => {
        if (!err && parseInt(response.statusCode) === 200) {
          console.log('[SMS Service] Sent notification!');
          cb();
        } else {
          console.log('[SMS Service] Error sending notification!', err);
          cb(err || 'Unexpected error');
        }
      },
    );
  });
};

module.exports = SmsNotificationService;
