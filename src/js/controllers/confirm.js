'use strict';

angular.module('copayApp.controllers').controller('confirmController', function($rootScope, $scope, $interval, $filter, $timeout, $ionicScrollDelegate, gettextCatalog, walletService, platformInfo, lodash, configService, rateService, $stateParams, $window, $state, $log, profileService, bitcore, gettext, txFormatService, ongoingProcess, $ionicModal, popupService, $ionicHistory, $ionicConfig) {
  var cachedTxp = {};
  var isChromeApp = platformInfo.isChromeApp;
  var countDown = null;
  $ionicConfig.views.swipeBackEnabled(false);

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    $scope.isWallet = data.stateParams.isWallet;
    $scope.cardId = data.stateParams.cardId;
    $scope.toAmount = data.stateParams.toAmount;
    $scope.toAddress = data.stateParams.toAddress;
    $scope.toName = data.stateParams.toName;
    $scope.toEmail = data.stateParams.toEmail;
    $scope.description = data.stateParams.description;
    $scope.paypro = data.stateParams.paypro;
    $scope._paypro = $scope.paypro;
    $scope.paymentExpired = {
      value: false
    };
    $scope.remainingTimeStr = {
      value: null
    };
    initConfirm();
  });

  var initConfirm = function() {
    // TODO (URL , etc)
    if (!$scope.toAddress || !$scope.toAmount) {
      $log.error('Bad params at amount');
      throw ('bad params');
    }
    $scope.isCordova = platformInfo.isCordova;
    $scope.hasClick = platformInfo.hasClick;
    $scope.data = {};

    var config = configService.getSync().wallet;
    $scope.feeLevel = config.settings && config.settings.feeLevel ? config.settings.feeLevel : 'normal';

    $scope.toAmount = parseInt($scope.toAmount);
    $scope.amountStr = txFormatService.formatAmountStr($scope.toAmount);
    $scope.displayAmount = getDisplayAmount($scope.amountStr);
    $scope.displayUnit = getDisplayUnit($scope.amountStr);

    var networkName = (new bitcore.Address($scope.toAddress)).network.name;
    $scope.network = networkName;

    $scope.insuffientFunds = false;
    $scope.noMatchingWallet = false;

    var wallets = profileService.getWallets({
      onlyComplete: true,
      network: networkName,
    });

    if (!wallets || !wallets.length) {
      $scope.noMatchingWallet = true;
    }

    var filteredWallets = [];
    var index = 0;
    var enoughFunds = false;

    lodash.each(wallets, function(w) {
      walletService.getStatus(w, {}, function(err, status) {
        if (err || !status) {
          $log.error(err);
        } else {
          w.status = status;
          if (!status.availableBalanceSat) $log.debug('No balance available in: ' + w.name);
          if (status.availableBalanceSat > $scope.toAmount) {
            filteredWallets.push(w);
            enoughFunds = true;
          }
        }

        if (++index == wallets.length) {
          if (!lodash.isEmpty(filteredWallets)) {
            $scope.wallets = lodash.clone(filteredWallets);
            setWallet($scope.wallets[0]);
          } else {

            if (!enoughFunds)
              $scope.insuffientFunds = true;

            $log.warn('No wallet available to make the payment');
          }
        }
      });
    });

    txFormatService.formatAlternativeStr($scope.toAmount, function(v) {
      $scope.alternativeAmountStr = v;
    });

    if($scope.paypro) {
      _paymentTimeControl($scope.paypro.expires);
    }

    $timeout(function() {
      $scope.$apply();
    }, 100);
  };

  $scope.$on('accepted', function(event) {
    $scope.approve();
  });

  $scope.$on('Wallet/Changed', function(event, wallet) {
    if (lodash.isEmpty(wallet)) {
      $log.debug('No wallet provided');
      return;
    }
    $log.debug('Wallet changed: ' + wallet.name);
    setWallet(wallet, true);
  });

  $scope.showWalletSelector = function() {
    $scope.showWallets = true;
  };

  $scope.onWalletSelect = function(wallet) {
    setWallet(wallet);
  };


  $scope.showDescriptionPopup = function() {
    var message = gettextCatalog.getString('Add description');
    var opts = {
      defaultText: $scope.description
    };

    popupService.showPrompt(null, message, opts, function(res) {
      if (typeof res != 'undefined') $scope.description = res;
      $timeout(function() {
        $scope.$apply();
      }, 100);
    });
  };

  function getDisplayAmount(amountStr) {
    return amountStr.split(' ')[0];
  }

  function getDisplayUnit(amountStr) {
    return amountStr.split(' ')[1];
  }

  function _paymentTimeControl(expirationTime) {
    $scope.paymentExpired.value = false;
    setExpirationTime();

    countDown = $interval(function() {
      setExpirationTime();
    }, 1000);

    function setExpirationTime() {
      var now = Math.floor(Date.now() / 1000);

      if (now > expirationTime) {
        setExpiredValues();
        return;
      }

      var totalSecs = expirationTime - now;
      var m = Math.floor(totalSecs / 60);
      var s = totalSecs % 60;
      $scope.remainingTimeStr.value = ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
    }

    function setExpiredValues() {
      $scope.paymentExpired.value = true;
      $scope.remainingTimeStr.value = gettextCatalog.getString('Expired');
      if (countDown) $interval.cancel(countDown);
      $timeout(function() {
        $scope.$apply();
      });
    }
  }

  function setWallet(wallet, delayed) {
    var stop;
    $scope.wallet = wallet;
    $scope.fee = $scope.txp = null;

    $timeout(function() {
      $ionicScrollDelegate.resize();
      $scope.$apply();
    }, 10);

    if (stop) {
      $timeout.cancel(stop);
      stop = null;
    }

    if (cachedTxp[wallet.id]) {
      apply(cachedTxp[wallet.id]);
    } else {
      stop = $timeout(function() {
        createTx(wallet, true, function(err, txp) {
          if (err) return;
          cachedTxp[wallet.id] = txp;
          apply(txp);
        });
      }, delayed ? 2000 : 1);
    }
  }

  var setSendError = function(msg) {
    $scope.sendStatus = '';
    $timeout(function() {
      $scope.$apply();
    });
    popupService.showAlert(gettextCatalog.getString('Error at confirm:'), msg);
  };

  function apply(txp) {
    $scope.fee = txFormatService.formatAmountStr(txp.fee);
    $scope.txp = txp;
    $scope.$apply();
  }

  var createTx = function(wallet, dryRun, cb) {
    var config = configService.getSync().wallet;
    var currentSpendUnconfirmed = config.spendUnconfirmed;
    var outputs = [];

    var paypro = $scope.paypro;
    var toAddress = $scope.toAddress;
    var toAmount = $scope.toAmount;
    var description = $scope.description;

    // ToDo: use a credential's (or fc's) function for this
    if (description && !wallet.credentials.sharedEncryptingKey) {
      var msg = 'Could not add message to imported wallet without shared encrypting key';
      $log.warn(msg);
      return setSendError(msg);
    }

    if (toAmount > Number.MAX_SAFE_INTEGER) {
      var msg = 'Amount too big';
      $log.warn(msg);
      return setSendError(msg);
    }

    outputs.push({
      'toAddress': toAddress,
      'amount': toAmount,
      'message': description
    });

    var txp = {};

    // TODO
    if (!lodash.isEmpty($scope.sendMaxInfo)) {
      txp.sendMax = true;
      txp.inputs = $scope.sendMaxInfo.inputs;
      txp.fee = $scope.sendMaxInfo.fee;
    }

    txp.outputs = outputs;
    txp.message = description;
    if(paypro) {
      txp.payProUrl = paypro.url;
    }
    txp.excludeUnconfirmedUtxos = config.spendUnconfirmed ? false : true;
    txp.feeLevel = config.settings && config.settings.feeLevel ? config.settings.feeLevel : 'normal';
    txp.dryRun = dryRun;

    walletService.createTx(wallet, txp, function(err, ctxp) {
      if (err) {
        setSendError(err);
        return cb(err);
      }
      return cb(null, ctxp);
    });
  };

  $scope.openPPModal = function() {
    $ionicModal.fromTemplateUrl('views/modals/paypro.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.payproModal = modal;
      $scope.payproModal.show();
    });
  };

  $scope.approve = function(onSendStatusChange) {
    if ($scope._paypro && $scope.paymentExpired.value) {
      popupService.showAlert(null, gettextCatalog.getString('The payment request has expired'));
      $scope.sendStatus = '';
      $timeout(function() {
        $scope.$apply();
      });
      return;
    }

    var wallet = $scope.wallet;
    if (!wallet) {
      return setSendError(gettextCatalog.getString('No wallet selected'));
    }

    if (!wallet.canSign() && !wallet.isPrivKeyExternal()) {
      $log.info('No signing proposal: No private key');

      return walletService.onlyPublish(wallet, txp, function(err, txp) {
        if (err) return setSendError(err);
      });
    }

    ongoingProcess.set('creatingTx', true, onSendStatusChange);
    createTx(wallet, false, function(err, txp) {
      ongoingProcess.set('creatingTx', false, onSendStatusChange);
      if (err) return;

      var config = configService.getSync();
      var spendingPassEnabled = walletService.isEncrypted(wallet);
      var touchIdEnabled = config.touchIdFor && config.touchIdFor[wallet.id];
      var isCordova = $scope.isCordova;
      var bigAmount = parseFloat(txFormatService.formatToUSD(txp.amount)) > 20;
      var message = gettextCatalog.getString('Sending {{amountStr}} from your {{name}} wallet', {
        amountStr: $scope.amountStr,
        name: wallet.name
      });
      var okText = gettextCatalog.getString('Confirm');
      var cancelText = gettextCatalog.getString('Cancel');

      if (!spendingPassEnabled && !touchIdEnabled) {
        if (isCordova) {
          if (bigAmount) {
            popupService.showConfirm(null, message, okText, cancelText, function(ok) {
              if (!ok) {
                $scope.sendStatus = '';
                $timeout(function() {
                  $scope.$apply();
                });
                return;
              }
              publishAndSign(wallet, txp, onSendStatusChange);
            });
          } else publishAndSign(wallet, txp, onSendStatusChange);
        } else {
          popupService.showConfirm(null, message, okText, cancelText, function(ok) {
            if (!ok) {
              $scope.sendStatus = '';
              return;
            }
            publishAndSign(wallet, txp, onSendStatusChange);
          });
        }
      } else publishAndSign(wallet, txp, onSendStatusChange);
    });
  };

  function statusChangeHandler(processName, showName, isOn) {
    $log.debug('statusChangeHandler: ', processName, showName, isOn);
    if ((processName === 'broadcastingTx' || ((processName === 'signingTx') && $scope.wallet.m > 1)) && !isOn) {
      $scope.sendStatus = 'success';
      $scope.$digest();
    } else if (showName) {
      $scope.sendStatus = showName;
    }
  }

  $scope.statusChangeHandler = statusChangeHandler;

  $scope.onConfirm = function() {
    $scope.approve(statusChangeHandler);
  };

  $scope.onSuccessConfirm = function() {
    var previousView = $ionicHistory.viewHistory().backView && $ionicHistory.viewHistory().backView.stateName;
    var fromBitPayCard = previousView.match(/tabs.bitpayCard/) ? true : false;

    $ionicHistory.nextViewOptions({
      disableAnimate: true
    });
    $ionicHistory.removeBackView();
    $scope.sendStatus = '';

    if (fromBitPayCard) {
      $timeout(function() {
        $state.transitionTo('tabs.bitpayCard', {
          id: $stateParams.cardId
        });
      }, 100);
    } else {
      $state.go('tabs.send');
    }
  };

  function publishAndSign(wallet, txp, onSendStatusChange) {
    walletService.publishAndSign(wallet, txp, function(err, txp) {
      if (err) return setSendError(err);
    }, onSendStatusChange);
  }
});
