'use strict';

var spec = {
  name: 'P2P',
  message: 'Internal Error on merit-p2p Module {0}'
};

module.exports = require('merit-lib').errors.extend(spec);
