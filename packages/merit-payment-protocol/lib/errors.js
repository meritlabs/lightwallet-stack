'use strict';

var spec = {
  name: 'PaymentProtocol',
  message: 'Internal Error on merit-payment-protocol Module: {0}',
};

module.exports = require('meritcore-lib').errors.extend(spec);
