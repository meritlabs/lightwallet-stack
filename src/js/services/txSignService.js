'use strict';

angular.module('copayApp.services').factory('txSignService', function($rootScope, profileService, gettextCatalog, lodash, trezor, ledger, configService, bwsError, $log) {
  var root = {};

  var reportSigningStatus = function(opts) {
    if (!opts.reporterFn) return;

    var fc = profileService.focusedClient;

    if (fc.isPrivKeyExternal()) {
      if (fc.getPrivKeyExternalSourceName() == 'ledger') {
        opts.reporterFn(gettextCatalog.getString('Requesting Ledger Wallet to sign'));
      } else if (fc.getPrivKeyExternalSourceName() == 'trezor') {
        opts.reporterFn(gettextCatalog.getString('Requesting Trezor Wallet to sign'));
      }
    } else {
      opts.reporterFn(gettextCatalog.getString('Signing payment'));
    }
  };

  var reportBroadcastingStatus = function(opts) {
    if (!opts.reporterFn) return;

    opts.reporterFn(gettextCatalog.getString('Broadcasting transaction'));
  };

  var stopReport = function(opts) {
    if (!opts.reporterFn) return;

    opts.reporterFn();
  };

  var requestTouchId = function(cb) {
    try {
      window.plugins.touchid.verifyFingerprint(
        gettextCatalog.getString('Scan your fingerprint please'),
        function(msg) {
          $log.debug('Touch ID OK');
          return cb();
        },
        function(msg) {
          $log.debug('Touch ID Failed:' + JSON.stringify(msg));
          return cb(gettextCatalog.getString('Touch ID Failed') + ': ' + msg.localizedDescription);
        }
      );
    } catch (e) {
      $log.debug('Touch ID Failed:' + JSON.stringify(e));
      return cb(gettextCatalog.getString('Touch ID Failed'));
    };
  };

  root.setTouchId = function(cb) {
    if (window.touchidAvailable) {
      requestTouchId(cb);
    } else {
      return cb();
    }
  };

  root.checkTouchId = function(cb) {
    var config = configService.getSync();
    var fc = profileService.focusedClient;
    config.touchIdFor = config.touchIdFor || {};
    if (window.touchidAvailable && config.touchIdFor[fc.credentials.walletId]) {
      requestTouchId(cb);
    } else {
      return cb();
    }
  };

  root.prepare = function(cb) {
    var fc = profileService.focusedClient;
    if (!fc.canSign() && !fc.isPrivKeyExternal())
      return cb('Cannot sign'); // should never happen, no need to translate

    root.checkTouchId(function(err) {
      if (err) {
        return cb(err);
      };

      profileService.unlockFC(function(err) {
        if (err) {
          return cb(bwsError.msg(err));
        };

        return cb();
      });
    });
  };

  var _signWithLedger = function(txp, cb) {
    var fc = profileService.focusedClient;
    $log.info('Requesting Ledger Chrome app to sign the transaction');

    ledger.signTx(txp, fc.credentials.account, function(result) {
      $log.debug('Ledger response', result);
      if (!result.success)
        return cb(result.message || result.error);

      txp.signatures = lodash.map(result.signatures, function(s) {
        return s.substring(0, s.length - 2);
      });
      return fc.signTxProposal(txp, cb);
    });
  };

  var _signWithTrezor = function(txp, cb) {
    var fc = profileService.focusedClient;
    $log.info('Requesting Trezor  to sign the transaction');

    var xPubKeys = lodash.pluck(fc.credentials.publicKeyRing, 'xPubKey');
    trezor.signTx(xPubKeys, txp, fc.credentials.account, function(err, result) {
      if (err) return cb(err);

      $log.debug('Trezor response', result);
      txp.signatures = result.signatures;
      return fc.signTxProposal(txp, cb);
    });
  };

  root.sign = function(txp, cb) {
    var fc = profileService.focusedClient;

    if (fc.isPrivKeyExternal()) {
      switch (fc.getPrivKeyExternalSourceName()) {
        case 'ledger':
          return _signWithLedger(txp, cb);
        case 'trezor':
          return _signWithTrezor(txp, cb);
        default:
          var msg = 'Unsupported External Key:' + fc.getPrivKeyExternalSourceName();
          $log.error(msg);
          return cb(msg);
      }
    } else {
      fc.signTxProposal(txp, function(err, signedTxp) {
        profileService.lockFC();
        return cb(err, signedTxp);
      });
    }
  };

  root.signAndBroadcast = function(txp, opts, cb) {
    reportSigningStatus(opts);

    var fc = profileService.focusedClient;
    root.sign(txp, function(err, txp) {
      if (err) {
        stopReport(opts);
        return cb(bwsError.msg(err), gettextCatalog.getString('Could not accept payment'));
      };

      if (txp.status != 'accepted') {
        stopReport(opts);
        return cb(null, txp);
      }

      reportBroadcastingStatus(opts);
      fc.broadcastTxProposal(txp, function(err, txp, memo) {
        stopReport(opts);

        if (err) {
          return cb(bwsError.msg(err, gettextCatalog.getString('Could not broadcast payment')));
        };

        $log.debug('Transaction signed and broadcasted')

        if (memo)
          $log.info(memo);

        return cb(null, txp);
      });
    });
  };

  root.prepareAndSignAndBroadcast = function(txp, opts, cb) {
    root.prepare(function(err) {
      if (err) {
        stopReport(opts);
        return cb(err);
      };
      reportSigningStatus(opts);
      root.signAndBroadcast(txp, opts, function(err, txp) {
        if (err) {
          stopReport(opts);
          return cb(err);
        };
        return cb(null, txp);
      });
    });
  };
  return root;
});
