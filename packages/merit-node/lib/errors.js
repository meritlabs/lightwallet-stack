'use strict';

var createError = require('errno').create;

var MeritcoreNodeError = createError('MeritcoreNodeError');

var RPCError = createError('RPCError', MeritcoreNodeError);

module.exports = {
  Error: MeritcoreNodeError,
  RPCError: RPCError
};
