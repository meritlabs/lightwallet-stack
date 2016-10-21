'use strict';

angular.module('copayApp.controllers').controller('txDetailsController', function($log, $timeout, $scope, $filter, $stateParams, ongoingProcess, walletService, lodash, gettextCatalog, profileService, configService, txFormatService, externalLinkService, popupService) {
  console.log('in txDetailsController');
  var config = configService.getSync();
  var configWallet = config.wallet;
  var walletSettings = configWallet.settings;
  var wallet;
  $scope.title = gettextCatalog.getString('Transaction');

  console.log('$stateParams', $stateParams);
  $scope.btx = $stateParams.tx;
  $scope.wallet = $stateParams.wallet;

  $scope.init = function() {
    console.log('init called');
    wallet = $scope.wallet;
    console.log('wallet', wallet);
    $scope.alternativeIsoCode = walletSettings.alternativeIsoCode;
    $scope.color = wallet.color;
    $scope.copayerId = wallet.credentials.copayerId;
    $scope.isShared = wallet.credentials.n > 1;
    $scope.btx.feeLevel = walletSettings.feeLevel;

    if ($scope.btx.action != 'invalid') {
      if ($scope.btx.action == 'sent') $scope.title = gettextCatalog.getString('Sent Funds');
      if ($scope.btx.action == 'received') $scope.title = gettextCatalog.getString('Received Funds');
      if ($scope.btx.action == 'moved') $scope.title = gettextCatalog.getString('Moved Funds');
    }

    updateMemo();
    initActionList();
    getAlternativeAmount();
  };

  function updateMemo() {
    walletService.getTxNote(wallet, $scope.btx.txid, function(err, note) {
      if (err) {
        $log.warn('Could not fetch transaction note: ' + err);
        return;
      }

      if (!note) return;

      $scope.btx.note = note;

      walletService.getTx(wallet, $scope.btx.txid, function(err, tx) {
        if (err) {
          $log.error(err);
          return;
        }

        tx.note = note;
        $timeout(function() {
          $scope.$apply();
        });
      });
    });
  };

  function initActionList() {
    $scope.actionList = [];
    if ($scope.btx.action != 'sent' || !$scope.isShared) return;

    var actionDescriptions = {
      created: gettextCatalog.getString('Proposal Created'),
      accept: gettextCatalog.getString('Accepted'),
      reject: gettextCatalog.getString('Rejected'),
      broadcasted: gettextCatalog.getString('Broadcasted'),
    };

    $scope.actionList.push({
      type: 'created',
      time: $scope.btx.createdOn,
      description: actionDescriptions['created'],
      by: $scope.btx.creatorName
    });

    lodash.each($scope.btx.actions, function(action) {
      $scope.actionList.push({
        type: action.type,
        time: action.createdOn,
        description: actionDescriptions[action.type],
        by: action.copayerName
      });
    });

    $scope.actionList.push({
      type: 'broadcasted',
      time: $scope.btx.time,
      description: actionDescriptions['broadcasted'],
    });
  };

  $scope.showCommentPopup = function() {
    var opts = {};
    if ($scope.btx.note && $scope.btx.note.body) opts.defaultText = $scope.btx.note.body;

    popupService.showPrompt(wallet.name, gettextCatalog.getString('Memo'), opts, function(text) {
      if (typeof text == "undefined") return;

      $log.debug('Saving memo');

      var args = {
        txid: $scope.btx.txid,
        body: text
      };

      walletService.editTxNote(wallet, args, function(err, res) {
        if (err) {
          $log.debug('Could not save tx comment ' + err);
          return;
        }
        // This is only to refresh the current screen data
        updateMemo();
        $scope.btx.searcheableString = null;
        $timeout(function() {
          $scope.$apply();
        });
      });
    });
  };

  var getAlternativeAmount = function() {
    var satToBtc = 1 / 100000000;

    wallet.getFiatRate({
      code: $scope.alternativeIsoCode,
      ts: $scope.btx.time * 1000
    }, function(err, res) {
      if (err) {
        $log.debug('Could not get historic rate');
        return;
      }
      if (res && res.rate) {
        var alternativeAmountBtc = ($scope.btx.amount * satToBtc).toFixed(8);
        $scope.rateDate = res.fetchedOn;
        $scope.rateStr = res.rate + ' ' + $scope.alternativeIsoCode;
        $scope.alternativeAmountStr = $filter('formatFiatAmount')(alternativeAmountBtc * res.rate) + ' ' + $scope.alternativeIsoCode;
        $timeout(function() {
          $scope.$apply();
        });
      }
    });
  };

  $scope.openExternalLink = function(url, optIn, title, message, okText, cancelText) {
    externalLinkService.open(url, optIn, title, message, okText, cancelText);
  };

  $scope.getShortNetworkName = function() {
    var n = wallet.credentials.network;
    return n.substring(0, 4);
  };

  $scope.cancel = function() {
    $scope.txDetailsModal.hide();
  };

  $scope.init();
});
