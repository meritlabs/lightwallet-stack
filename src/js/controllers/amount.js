'use strict';

angular.module('copayApp.controllers').controller('amountController', function($scope, $filter, $timeout, $ionicScrollDelegate, $ionicHistory, gettextCatalog, platformInfo, lodash, configService, rateService, $stateParams, $window, $state, $log, txFormatService, ongoingProcess, bitpayCardService, popupService, bwcError, payproService, profileService, bitcore, amazonService, glideraService) {
  var unitToSatoshi;
  var satToUnit;
  var unitDecimals;
  var satToBtc;
  var SMALL_FONT_SIZE_LIMIT = 10;
  var LENGTH_EXPRESSION_LIMIT = 19;
  $scope.isChromeApp = platformInfo.isChromeApp;

  $scope.$on('$ionicView.leave', function() {
    angular.element($window).off('keydown');
  });

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    $scope.isGiftCard = data.stateParams.isGiftCard;

    // Glidera parameters
    $scope.isGlidera = data.stateParams.isGlidera;
    $scope.glideraAccessToken = data.stateParams.glideraAccessToken;

    $scope.cardId = data.stateParams.cardId;
    $scope.showMenu = $ionicHistory.backView() && $ionicHistory.backView().stateName == 'tabs.send';
    var isWallet = data.stateParams.isWallet || 'false';
    $scope.isWallet = (isWallet.toString().trim().toLowerCase() == 'true' ? true : false);
    $scope.toAddress = data.stateParams.toAddress;
    $scope.toName = data.stateParams.toName;
    $scope.toEmail = data.stateParams.toEmail;
    $scope.showAlternativeAmount = !!$scope.cardId || !!$scope.isGiftCard || !!$scope.isGlidera;
    $scope.toColor = data.stateParams.toColor;
    $scope.showSendMax = false;

    $scope.customAmount = data.stateParams.customAmount;

    if (!$scope.cardId && !$scope.isGiftCard && !$scope.isGlidera && !data.stateParams.toAddress) {
      $log.error('Bad params at amount')
      throw ('bad params');
    }

    if ($scope.isGlidera) {
      glideraService.getLimits($scope.glideraAccessToken, function(err, limits) {
        $scope.limits = limits;
        $timeout(function() {
          $scope.$apply();
        });
      });
    }

    var reNr = /^[1234567890\.]$/;
    var reOp = /^[\*\+\-\/]$/;

    var disableKeys = angular.element($window).on('keydown', function(e) {
      if (e.which === 8) { // you can add others here inside brackets.
        e.preventDefault();
        $scope.removeDigit();
      }

      if (e.key && e.key.match(reNr))
        $scope.pushDigit(e.key);

      else if (e.key && e.key.match(reOp))
        $scope.pushOperator(e.key);

      else if (e.key && e.key == 'Enter')
        $scope.finish();

      $timeout(function() {
        $scope.$apply();
      });
    });

    var config = configService.getSync().wallet.settings;
    $scope.unitName = config.unitName;
    $scope.alternativeIsoCode = !!$scope.cardId || !!$scope.isGiftCard ? 'USD' : config.alternativeIsoCode;
    $scope.specificAmount = $scope.specificAlternativeAmount = '';
    $scope.isCordova = platformInfo.isCordova;
    unitToSatoshi = config.unitToSatoshi;
    satToUnit = 1 / unitToSatoshi;
    satToBtc = 1 / 100000000;
    unitDecimals = config.unitDecimals;

    $scope.resetAmount();

    // in SAT ALWAYS
    if ($stateParams.toAmount) {
      $scope.amount = (($stateParams.toAmount) * satToUnit).toFixed(unitDecimals);
    }

    processAmount($scope.amount);

    $timeout(function() {
      $ionicScrollDelegate.resize();
    }, 10);
  });

  $scope.showSendMaxMenu = function() {
    $scope.showSendMax = true;
  };

  $scope.sendMax = function() {
    $scope.showSendMax = false;
    $state.transitionTo('tabs.send.confirm', {
      isWallet: $scope.isWallet,
      toAmount: null,
      toAddress: $scope.toAddress,
      toName: $scope.toName,
      toEmail: $scope.toEmail,
      useSendMax: true,
    });
  };

  $scope.toggleAlternative = function() {
    $scope.showAlternativeAmount = !$scope.showAlternativeAmount;

    if ($scope.amount && isExpression($scope.amount)) {
      var amount = evaluate(format($scope.amount));
      $scope.globalResult = '= ' + processResult(amount);
    }
  };

  function checkFontSize() {
    if ($scope.amount && $scope.amount.length >= SMALL_FONT_SIZE_LIMIT) $scope.smallFont = true;
    else $scope.smallFont = false;
  };

  $scope.pushDigit = function(digit) {
    if ($scope.amount && $scope.amount.length >= LENGTH_EXPRESSION_LIMIT) return;
    if ($scope.amount.indexOf('.') > -1 && digit == '.') return;
    if ($scope.showAlternativeAmount && $scope.amount.indexOf('.') > -1 && $scope.amount[$scope.amount.indexOf('.') + 2]) return;

    $scope.amount = ($scope.amount + digit).replace('..', '.');
    checkFontSize();
    processAmount($scope.amount);
  };

  $scope.pushOperator = function(operator) {
    if (!$scope.amount || $scope.amount.length == 0) return;
    $scope.amount = _pushOperator($scope.amount);

    function _pushOperator(val) {
      if (!isOperator(lodash.last(val))) {
        return val + operator;
      } else {
        return val.slice(0, -1) + operator;
      }
    };
  };

  function isOperator(val) {
    var regex = /[\/\-\+\x\*]/;
    return regex.test(val);
  };

  function isExpression(val) {
    var regex = /^\.?\d+(\.?\d+)?([\/\-\+\*x]\d?\.?\d+)+$/;
    return regex.test(val);
  };

  $scope.removeDigit = function() {
    $scope.amount = $scope.amount.slice(0, -1);
    processAmount($scope.amount);
    checkFontSize();
  };

  $scope.resetAmount = function() {
    $scope.amount = $scope.alternativeResult = $scope.amountResult = $scope.globalResult = '';
    $scope.allowSend = false;
    checkFontSize();
  };

  function processAmount(val) {
    if (!val) {
      $scope.resetAmount();
      return;
    }

    var formatedValue = format(val);
    var result = evaluate(formatedValue);
    $scope.allowSend = lodash.isNumber(result) && +result > 0;
    if (lodash.isNumber(result)) {
      $scope.globalResult = isExpression(val) ? '= ' + processResult(result) : '';
      $scope.amountResult = $filter('formatFiatAmount')(toFiat(result));
      $scope.alternativeResult = txFormatService.formatAmount(fromFiat(result) * unitToSatoshi, true);
    }
  };

  function processResult(val) {
    if ($scope.showAlternativeAmount)
      return $filter('formatFiatAmount')(val);
    else
      return txFormatService.formatAmount(val.toFixed(unitDecimals) * unitToSatoshi, true);
  };

  function fromFiat(val) {
    return parseFloat((rateService.fromFiat(val, $scope.alternativeIsoCode) * satToUnit).toFixed(unitDecimals));
  };

  function toFiat(val) {
    return parseFloat((rateService.toFiat(val * unitToSatoshi, $scope.alternativeIsoCode)).toFixed(2));
  };

  function evaluate(val) {
    var result;
    try {
      result = $scope.$eval(val);
    } catch (e) {
      return 0;
    }
    if (!lodash.isFinite(result)) return 0;
    return result;
  };

  function format(val) {
    var result = val.toString();

    if (isOperator(lodash.last(val)))
      result = result.slice(0, -1);

    return result.replace('x', '*');
  };

  $scope.getRates = function() {
    bitpayCardService.getRates($scope.alternativeIsoCode, function(err, res) {
      if (err) {
        $log.warn(err);
        return;
      }
      if ($scope.unitName == 'bits') {
        $scope.exchangeRate = '1,000,000 bits ~ ' + res.rate + ' ' + $scope.alternativeIsoCode;
      } else {
        $scope.exchangeRate = '1 BTC ~ ' + res.rate + ' ' + $scope.alternativeIsoCode;
      }
    });
  };

  $scope.finish = function() {
    var _amount = evaluate(format($scope.amount));

    if ($scope.cardId) {
      var amountUSD = $scope.showAlternativeAmount ? _amount : $filter('formatFiatAmount')(toFiat(_amount));

      var dataSrc = {
        amount: amountUSD,
        currency: 'USD'
      };

      ongoingProcess.set('Preparing transaction...', true);
      $timeout(function() {

        bitpayCardService.topUp($scope.cardId, dataSrc, function(err, invoiceId) {
          if (err) {
            ongoingProcess.set('Preparing transaction...', false);
            popupService.showAlert(gettextCatalog.getString('Error'), bwcError.msg(err));
            return;
          }

          bitpayCardService.getInvoice(invoiceId, function(err, data) {
            if (err) {
              ongoingProcess.set('Preparing transaction...', false);
              popupService.showAlert(gettextCatalog.getString('Error'), bwcError.msg(err));
              return;
            }
            var payProUrl = data.paymentUrls.BIP73;

            payproService.getPayProDetails(payProUrl, function(err, payProDetails) {
              ongoingProcess.set('Preparing transaction...', false);
              if (err) {
                popupService.showAlert(gettextCatalog.getString('Error'), bwcError.msg(err));
                return;
              }
              var stateParams = {
                cardId: $scope.cardId,
                cardAmountUSD: amountUSD,
                toName: $scope.toName,
                toAmount: payProDetails.amount,
                toAddress: payProDetails.toAddress,
                description: payProDetails.memo,
                paypro: payProDetails
              };

              $state.transitionTo('tabs.bitpayCard.confirm', stateParams);
            }, true);
          });
        });
      });

    } else if ($scope.isGiftCard) {
      ongoingProcess.set('Preparing transaction...', true);
      // Get first wallet as UUID
      var uuid;
      try {
        uuid = profileService.getWallets({
          onlyComplete: true,
          network: amazonService.getEnvironment(),
        })[0].id;
      } catch (err) {
        ongoingProcess.set('Preparing transaction...', false);
        popupService.showAlert(gettextCatalog.getString('Error'), gettextCatalog.getString('No wallet found!'));
        return;
      };
      var amountUSD = $scope.showAlternativeAmount ? _amount : $filter('formatFiatAmount')(toFiat(_amount));
      var dataSrc = {
        currency: 'USD',
        amount: amountUSD,
        uuid: uuid
      };

      amazonService.createBitPayInvoice(dataSrc, function(err, dataInvoice) {
        if (err) {
          ongoingProcess.set('Preparing transaction...', false);
          popupService.showAlert(gettextCatalog.getString('Error'), bwcError.msg(err));
          return;
        }

        amazonService.getBitPayInvoice(dataInvoice.invoiceId, function(err, invoice) {
          if (err) {
            ongoingProcess.set('Preparing transaction...', false);
            popupService.showAlert(gettextCatalog.getString('Error'), bwcError.msg(err));
            return;
          }

          var payProUrl = invoice.paymentUrls.BIP73;

          payproService.getPayProDetails(payProUrl, function(err, payProDetails) {
            ongoingProcess.set('Preparing transaction...', false);
            if (err) {
              popupService.showAlert(gettextCatalog.getString('Error'), bwcError.msg(err));
              return;
            }
            var stateParams = {
              giftCardAmountUSD: amountUSD,
              giftCardAccessKey: dataInvoice.accessKey,
              giftCardInvoiceTime: invoice.invoiceTime,
              giftCardUUID: dataSrc.uuid,
              toAmount: payProDetails.amount,
              toAddress: payProDetails.toAddress,
              description: payProDetails.memo,
              paypro: payProDetails
            };

            $state.transitionTo('tabs.giftcards.amazon.confirm', stateParams);
          }, true);
        });
      });
    } else if ($scope.isGlidera) {
      var amount = $scope.showAlternativeAmount ? fromFiat(_amount) : _amount;
      $state.transitionTo('tabs.buyandsell.glidera.confirm', {
        toAmount: (amount * unitToSatoshi).toFixed(0),
        isGlidera: $scope.isGlidera,
        glideraAccessToken: $scope.glideraAccessToken
      });
    } else {
      var amount = $scope.showAlternativeAmount ? fromFiat(_amount) : _amount;
      if ($scope.customAmount) {
        $state.transitionTo('tabs.receive.customAmount', {
          toAmount: (amount * unitToSatoshi).toFixed(0),
          toAddress: $scope.toAddress
        });
      } else {
        $state.transitionTo('tabs.send.confirm', {
          isWallet: $scope.isWallet,
          toAmount: (amount * unitToSatoshi).toFixed(0),
          toAddress: $scope.toAddress,
          toName: $scope.toName,
          toEmail: $scope.toEmail
        });
      }
    }
  };
});
