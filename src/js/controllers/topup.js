'use strict';

angular.module('copayApp.controllers').controller('topUpController', function($scope, $log, $state, $timeout, $ionicHistory, $ionicConfig, lodash, popupService, profileService, ongoingProcess, walletService, configService, platformInfo, bitpayService, bitpayCardService, payproService, bwcError, txFormatService, sendMaxService, gettextCatalog) {

  $scope.isCordova = platformInfo.isCordova;
  var cardId;
  var useSendMax;
  var amount;
  var currency;
  var createdTx;
  var message;
  var configWallet = configService.getSync().wallet;

  var showErrorAndBack = function(title, msg) {
    title = title || gettextCatalog.getString('Error');
    $scope.sendStatus = '';
    $log.error(msg);
    msg = msg.errors ? msg.errors[0].message : msg;
    popupService.showAlert(title, msg, function() {
      $ionicHistory.goBack();
    });
  };

  var showError = function(title, msg) {
    title = title || gettextCatalog.getString('Error');
    $scope.sendStatus = '';
    $log.error(msg);
    msg = msg.errors ? msg.errors[0].message : msg;
    popupService.showAlert(title, msg);
  };

  var satToAlternative = function(sat, cb) {
    txFormatService.formatToCode(sat, $scope.currencyIsoCode, function(value) {
      return cb(value);
    });
  };

  var publishAndSign = function (wallet, txp, onSendStatusChange, cb) {
    if (!wallet.canSign() && !wallet.isPrivKeyExternal()) {
      var err = gettextCatalog.getString('No signing proposal: No private key');
      $log.info(err);
      return cb(err);
    }

    walletService.publishAndSign(wallet, txp, function(err, txp) {
      if (err) return cb(err);
      return cb(null, txp);
    }, onSendStatusChange);
  };

  var statusChangeHandler = function (processName, showName, isOn) {
    $log.debug('statusChangeHandler: ', processName, showName, isOn);
    if (processName == 'topup' && !isOn && !hasError) {
      $scope.sendStatus = 'success';
      $timeout(function() {
        $scope.$digest();
      }, 100);
    } else if (showName) {
      $scope.sendStatus = showName;
    }
  };

  var setTotalAmount = function(amountSat, invoiceFeeSat, networkFeeSat) {
    satToAlternative(amountSat, function(a) {
      $scope.amount = Number(a);

      satToAlternative(invoiceFeeSat, function(i) {
        $scope.invoiceFee = Number(i);

        satToAlternative(networkFeeSat, function(n) {
          $scope.networkFee = Number(n);
          $scope.totalAmount = $scope.amount + $scope.invoiceFee + $scope.networkFee;
          $timeout(function() {
            $scope.$digest();
          });
        });
      });
    });
  };

  var createInvoice = function(data, cb) {
    bitpayCardService.topUp(cardId, data, function(err, invoiceId) {
      if (err) {
        return cb({
          title: gettextCatalog.getString('Could not create the invoice'),
          message: err
        });
      }

      bitpayCardService.getInvoice(invoiceId, function(err, inv) {
        if (err) {
          return cb({
            title: gettextCatalog.getString('Could not get the invoice'),
            message: err
          });
        }
        return cb(null, inv);
      });
    });
  };

  var createTx = function(wallet, invoice, message, cb) {
    var payProUrl = (invoice && invoice.paymentUrls) ? invoice.paymentUrls.BIP73 : null;

    if (!payProUrl) {
      return cb({
        title: gettextCatalog.getString('Error in Payment Protocol'),
        message: gettextCatalog.getString('Invalid URL')
      });
    }

    var outputs = [];
    var toAddress = invoice.bitcoinAddress;
    var amountSat = parseInt(invoice.btcDue * 100000000); // BTC to Satoshi

    outputs.push({
      'toAddress': toAddress,
      'amount': amountSat,
      'message': message
    });

    var txp = {
      toAddress: toAddress,
      amount: amountSat,
      outputs: outputs,
      message: message,
      payProUrl: payProUrl,
      excludeUnconfirmedUtxos: configWallet.spendUnconfirmed ? false : true,
      feeLevel: configWallet.settings.feeLevel || 'normal'
    };

    walletService.createTx(wallet, txp, function(err, ctxp) {
      if (err) {
        return cb({
          title: gettextCatalog.getString('Could not create transaction'),
          message: bwcError.msg(err)
        });
      }
      return cb(null, ctxp);
    });
  };

  var parseAmount = function(wallet, cb) {
    if (useSendMax) {
      sendMaxService.getInfo(wallet, function(err, values) {
        if (err) {
          return cb({
            title: null,
            message: err
          })
        }
        var maxAmountBtc = (values.amount / 100000000).toFixed(8);
console.log('[topup.js:152]',maxAmountBtc); //TODO/

        createInvoice({amount: maxAmountBtc, currency: 'BTC'}, function(err, inv) {
          if (err) return cb(err);

          return cb(null, txFormatService.parseAmount(maxAmountBtc - inv.btcDue, 'BTC'));
        });
      });
    } else {
      return cb(null, txFormatService.parseAmount(amount, currency));
    }
  };

  var initializeTopUp = function(wallet, parsedAmount) {
    $scope.amountUnitStr = parsedAmount.amountUnitStr;
    var dataSrc = {
      amount: parsedAmount.amount,
      currency: parsedAmount.currency
    };
    ongoingProcess.set('loadingTxInfo', true);
    createInvoice(dataSrc, function(err, invoice) {
console.log('[topup.js:155] INVOICE',invoice); //TODO/
      if (err) {
        ongoingProcess.set('loadingTxInfo', false);
        showErrorAndBack(err.title, err.message);
        return;
      }

      var invoiceFeeSat = (invoice.buyerPaidBtcMinerFee * 100000000).toFixed();

      message = gettextCatalog.getString("Top up {{amountStr}} to debit card ({{cardLastNumber}})", {
        amountStr: $scope.amountUnitStr,
        cardLastNumber: $scope.lastFourDigits
      });

      createTx(wallet, invoice, message, function(err, ctxp) {
console.log('[topup.js:159] CREATE TX',ctxp); //TODO
        ongoingProcess.set('loadingTxInfo', false);
        if (err) {
          showErrorAndBack(err.title, err.message);
          return;
        }

        createdTx = ctxp;

        var totalAmountSat = ctxp.amount + ctxp.fee;
        $scope.totalAmountStr = txFormatService.formatAmountStr(totalAmountSat);

        setTotalAmount(parsedAmount.amountSat, invoiceFeeSat, ctxp.fee);

      });

    });

  };

  $scope.$on("$ionicView.beforeLeave", function(event, data) {
    $ionicConfig.views.swipeBackEnabled(true);
  });

  $scope.$on("$ionicView.enter", function(event, data) {
    $ionicConfig.views.swipeBackEnabled(false);
  });

  $scope.$on("$ionicView.beforeEnter", function(event, data) {

    cardId = data.stateParams.id;
    useSendMax = data.stateParams.useSendMax;
    amount = data.stateParams.amount;
    currency = data.stateParams.currency;
console.log('[topup.js:201]',cardId, useSendMax, amount, currency); //TODO/

    bitpayCardService.get({ cardId: cardId, noRefresh: true }, function(err, card) {
console.log('[topup.js:203]',card[0]); //TODO/
      if (err) {
        showErrorAndBack(null, err);
        return;
      }
      bitpayCardService.setCurrencySymbol(card[0]);
      $scope.lastFourDigits = card[0].lastFourDigits;
      $scope.currencySymbol = card[0].currencySymbol;
      $scope.currencyIsoCode = card[0].currency;

      $scope.wallets = profileService.getWallets({
        onlyComplete: true,
        network: bitpayService.getEnvironment().network,
        hasFunds: true
      });

      if (lodash.isEmpty($scope.wallets)) {
        showErrorAndBack(null, gettextCatalog.getString('No wallets with funds'));
        return;
      }

      bitpayCardService.getRates($scope.currencyIsoCode, function(err, r) {
        if (err) $log.error(err);
        $scope.rate = r.rate;
      });

      $scope.onWalletSelect($scope.wallets[0]); // Default first wallet
    });
  });

  $scope.topUpConfirm = function() {
    var title = gettextCatalog.getString('Confirm');
    var okText = gettextCatalog.getString('OK');
    var cancelText = gettextCatalog.getString('Cancel');
    popupService.showConfirm(title, message, okText, cancelText, function(ok) {
      if (!ok) {
        $scope.sendStatus = '';
        return;
      }

      ongoingProcess.set('topup', true, statusChangeHandler);
      publishAndSign($scope.wallet, createdTx, function() {}, function(err, txSent) {
        if (err) {
          ongoingProcess.set('topup', false);
          $scope.sendStatus = '';
          showError(gettextCatalog.getString('Could not send transaction'), err);
          return;
        }
        ongoingProcess.set('topup', false, statusChangeHandler);
      });
    });
  };

  $scope.showWalletSelector = function() {
    $scope.walletSelectorTitle = 'From';
    $scope.showWallets = true;
  };

  $scope.onWalletSelect = function(wallet) {
    $scope.wallet = wallet;
    ongoingProcess.set('retrievingInputs', true);
    parseAmount(wallet, function(err, parsedAmount) {
console.log('[topup.js:287]',parsedAmount); //TODO/
      ongoingProcess.set('retrievingInputs', false);
      if (err) {
        showErrorAndBack(err.title, err.message);
        return;
      }
      initializeTopUp(wallet, parsedAmount);
    });
  };

  $scope.goBackHome = function() {
    $scope.sendStatus = '';
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      historyRoot: true
    });
    $ionicHistory.clearHistory();
    $state.go('tabs.home').then(function() {
      $state.transitionTo('tabs.bitpayCard', {id: cardId});
    });
  };

});
