const request = require('request');
const MessageBroker = require('./messagebroker');
const Storage = require('./storage');
const _ = require('lodash');

function SmsNotificationService(opts) {
  this.messageBroker = opts.messageBroker || new MessageBroker(opts.messageBrokerOpts);
  this.messageBroker.onMessage(this.sendSMS.bind(this));
  this.notificationsServiceUrl = opts.meritMessagingUrl;

  if (opts.storage) {
    this.storage = opts.storage;
  } else {
    this.storage = new Storage();
    this.storage.connect(opts.storageOpts, () => {});
  }
}

SmsNotificationService.prototype.sendSMS = function(notification, cb) {
  cb = cb || (() => {});
  if (notification.type === 'NewTxProposal') return cb();

  this.storage.fetchSmsNotificationSub(notification.walletId, (err, recipient) => {
    if (err) return cb(err);
    if (!recipient) return cb();

    console.log('Sending SMS notification', notification, recipient);

    const { amount, isInvite } = notification.data;

    request({
      method: 'POST',
      uri: this.notificationsServiceUrl + '/notification',
      json: {
        type: 'sms',
        destination: recipient.phoneNumber,
        id: notification.id,
        template: _.snakeCase(notification.type),
        language: 'en',
        notification: {
          amount: isInvite? amount : amount / 1e8
        }
      }
    }, (err, response) => {
      if (!err && parseInt(response.statusCode) === 200) {
        cb();
      } else {
        cb(err || 'Unexpected error');
      }
    });
  });
};

module.exports = SmsNotificationService;
