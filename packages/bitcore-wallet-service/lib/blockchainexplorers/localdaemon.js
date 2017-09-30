/**
 * This is the new (proposed) approach for accessing the blockchain in a more reliable and fast way.
 * Instead of utilizing a blockchain explorer as an intermediary for the WalletService, Merit plans
 * to ensure that one (or multiple) merit daemons are accessible directly by the walletService.
 * 
 * Eventually, the WalletService and the Blockchain Explorer should utilize the same shared Lib for how 
 * they interact with the local daemon.
 */
'use strict';

var _ = require('lodash');
var $ = require('preconditions').singleton();
var log = require('npmlog');
log.debug = log.verbose;
var io = require('socket.io-client');
var requestList = require('./request-list');

function Insight(opts) {}