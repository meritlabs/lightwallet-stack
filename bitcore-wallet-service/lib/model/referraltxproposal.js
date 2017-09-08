'use strict';

const _ = require('lodash');
const $ = require('preconditions').singleton();
const Uuid = require('uuid');
const log = require('npmlog');

const Bitcore = require('bitcore-lib');

const Common = require('../common');
const Constants = Common.Constants;
const Defaults = Common.Defaults;

function ReferralTxProposal() {};
