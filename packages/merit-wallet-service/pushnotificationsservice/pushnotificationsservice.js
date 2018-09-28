#!/usr/bin/env node

'use strict';

const log = require('npmlog');
log.debug = log.verbose;
log.level = 'debug';

const config = require('../config');
const PushNotificationsService = require('../lib/pushnotificationsservice');

if (config.pushNotificationsOpts) {
  const pushNotificationsService = new PushNotificationsService();
  pushNotificationsService.start(config, function(err) {
    if (err) throw err;

    log.debug('Push Notification Service started');
  });
} else {
  log.debug('Push Notification Service is not configured, ignoring.');
}
