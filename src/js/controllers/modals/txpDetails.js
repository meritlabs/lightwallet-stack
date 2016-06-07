'use strict';

angular.module('copayApp.controllers').controller('txpDetailsController', function($scope, $rootScope, $timeout, $interval, platformInfo, txStatus, $ionicScrollDelegate, txFormatService, fingerprintService, bwsError, gettextCatalog, lodash, profileService, walletService) {
  var self = $scope.self;
  var tx = $scope.tx;
  var copayers = $scope.copayers;
  var isGlidera = $scope.isGlidera;
  var now = Math.floor(Date.now() / 1000);
  var fc = profileService.focusedClient;
  $scope.loading = null;
  $scope.copayerId = fc.credentials.copayerId;
  $scope.isShared = fc.credentials.n > 1;
  $scope.canSign = fc.canSign() || fc.isPrivKeyExternal();
  $scope.color = fc.backgroundColor;

  checkPaypro();

  // ToDo: use tx.customData instead of tx.message
  if (tx.message === 'Glidera transaction' && isGlidera) {
    tx.isGlidera = true;
    if (tx.canBeRemoved) {
      tx.canBeRemoved = (Date.now() / 1000 - (tx.ts || tx.createdOn)) > GLIDERA_LOCK_TIME;
    }
  }

  $scope.sign = function(txp) {
    $scope.error = null;
    $scope.loading = 'Signing Transaction';

    fingerprintService.check(fc, function(err) {
      if (err) {
        $scope.error = err;
        $scope.loading = null;
        return;
      }

      handleEncryptedWallet(function(err) {
        if (err) {
          $scope.error = err;
          $scope.loading = null;
          return;
        }

        walletService.signTx(fc, txp, function(err, signedTxp) {
          walletService.lock(fc);
          if (err) {
            $scope.error = err;
            $scope.loading = null;
            return;
          }

          if (signedTxp.status == 'accepted') {
            $scope.loading = 'Broadcasting Transaction';
            walletService.broadcastTx(fc, signedTxp, function(err, broadcastedTxp) {
              $scope.loading = null;
              $scope.$emit('UpdateTx');
              $scope.close(broadcastedTxp);
              if (err) {
                $scope.error = err;
              }
            });
          } else {
            $scope.loading = null;
            $scope.$emit('UpdateTx');
            $scope.close(signedTxp);
          }
        });
      });
    });
  };

  $scope.reject = function(txp) {
    $scope.loading = 'Rejecting payment';
    $scope.error = null;

    $timeout(function() {
      walletService.rejectTx(fc, txp, function(err, txpr) {
        $scope.loading = null;

        if (err) {
          $scope.$emit('UpdateTx');
          $scope.error = bwsError.msg(err, gettextCatalog.getString('Could not reject payment'));
          $scope.$digest();
        } else {
          $scope.close(txpr);
        }
      });
    }, 10);
  };

  $scope.remove = function(txp) {
    $scope.loading = 'Deleting Payment';
    $scope.error = null;

    $timeout(function() {
      walletService.removeTx(fc, txp, function(err) {
        $scope.loading = null;

        // Hacky: request tries to parse an empty response
        if (err && !(err.message && err.message.match(/Unexpected/))) {
          $scope.$emit('UpdateTx');
          $scope.error = bwsError.msg(err, gettextCatalog.getString('Could not delete payment proposal'));
          $scope.$digest();
          return;
        }
        $scope.close();
      });
    }, 10);
  };

  $scope.broadcast = function(txp) {
    $scope.loading = 'Broadcasting Payment';
    $scope.error = null;

    $timeout(function() {
      walletService.broadcastTx(fc, txp, function(err, txpb) {
        $scope.loading = null;

        if (err) {
          $scope.error = bwsError.msg(err, gettextCatalog.getString('Could not broadcast payment'));
          $scope.$digest();
          return;
        }
        $scope.close(txpb);
      });
    }, 10);
  };

  $scope.getShortNetworkName = function() {
    return fc.credentials.networkName.substring(0, 4);
  };

  function checkPaypro() {
    if (tx.payProUrl && !platformInfo.isChromeApp) {
      fc.fetchPayPro({
        payProUrl: tx.payProUrl,
      }, function(err, paypro) {
        if (err) return;
        tx.paypro = paypro;
        paymentTimeControl(tx.paypro.expires);
        $timeout(function() {
          $ionicScrollDelegate.resize();
        }, 100);
      });
    }
  };

  function paymentTimeControl(expirationTime) {
    $scope.paymentExpired = false;
    setExpirationTime();

    self.countDown = $interval(function() {
      setExpirationTime();
    }, 1000);

    function setExpirationTime() {
      var now = Math.floor(Date.now() / 1000);
      if (now > expirationTime) {
        $scope.paymentExpired = true;
        if (self.countDown) $interval.cancel(self.countDown);
        return;
      }
      var totalSecs = expirationTime - now;
      var m = Math.floor(totalSecs / 60);
      var s = totalSecs % 60;
      $scope.expires = ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
    };
  };

  lodash.each(['TxProposalRejectedBy', 'TxProposalAcceptedBy', 'transactionProposalRemoved', 'TxProposalRemoved', 'NewOutgoingTx', 'UpdateTx'], function(eventName) {
    $scope.$on(eventName, function() {
      fc.getTx($scope.tx.id, function(err, tx) {
        if (err) {
          if (err.message && err.message == 'TX_NOT_FOUND' &&
            (eventName == 'transactionProposalRemoved' || eventName == 'TxProposalRemoved')) {
            $scope.tx.removed = true;
            $scope.tx.canBeRemoved = false;
            $scope.tx.pendingForUs = false;
            $scope.$apply();
            return;
          }
          return;
        }

        var action = lodash.find(tx.actions, {
          copayerId: fc.credentials.copayerId
        });

        $scope.tx = txFormatService.processTx(tx);

        if (!action && tx.status == 'pending')
          $scope.tx.pendingForUs = true;

        $scope.updateCopayerList();
        $scope.$apply();
      });
    });
  });

  $scope.updateCopayerList = function() {
    lodash.map($scope.copayers, function(cp) {
      lodash.each($scope.tx.actions, function(ac) {
        if (cp.id == ac.copayerId) {
          cp.action = ac.type;
        }
      });
    });
  };

  function handleEncryptedWallet(cb) {
    if (!walletService.isEncrypted(fc)) return cb();
    $rootScope.$emit('Local/NeedsPassword', false, function(err, password) {
      if (err) return cb(err);
      return cb(null, walletService.unlock(fc, password));
    });
  };

  $scope.copyToClipboard = function(addr) {
    if (!addr) return;
    self.copyToClipboard(addr);
  };

  $scope.close = function(txp) {
    $scope.loading = null;
    if (txp) {
      txStatus.notify(txp, function() {
        $scope.$emit('Local/TxProposalAction', txp.status == 'broadcasted');
      });
    } else {
      $timeout(function() {
        $scope.$emit('Local/TxProposalAction');
      }, 100);
    }
    $scope.cancel();
  };

  $scope.cancel = function() {
    $scope.txpDetailsModal.hide();
  };
});
