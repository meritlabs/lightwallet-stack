'use strict';

angular.module('copayApp.controllers').controller('txDetailsController', function($log, $timeout, $scope, $filter, $stateParams, ongoingProcess, walletService, lodash, gettextCatalog, profileService, configService, txFormatService, externalLinkService, popupService) {
  var config = configService.getSync();
  var configWallet = config.wallet;
  var walletSettings = configWallet.settings;
  var wallet;
  $scope.title = gettextCatalog.getString('Transaction');

  $scope.btx = $stateParams.tx;
  $scope.wallet = $stateParams.wallet;

  $scope.init = function() {
    wallet = $scope.wallet;
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

    $scope.displayAmount = getDisplayAmount($scope.btx.amountStr);
    $scope.displayUnit = getDisplayUnit($scope.btx.amountStr);

    updateMemo();
    initActionList();
  };

  function getDisplayAmount(amountStr) {
    return amountStr.split(' ')[0];
  }

  function getDisplayUnit(amountStr) {
    return amountStr.split(' ')[1];
  }

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
  }

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
  }

  $scope.showCommentPopup = function() {
    var opts = {};
    if($scope.btx.message) {
      opts.defaultText = $scope.btx.message;
    }
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

  $scope.viewOnBlockchain = function() {
    var btx = $scope.btx;
    var url = 'https://' + ($scope.getShortNetworkName() == 'test' ? 'test-' : '') + 'insight.bitpay.com/tx/' + btx.txid;
    var title = 'View Transaction on Insight';
    var message = 'Would you like to view this transaction on the Insight blockchain explorer?';
    $scope.openExternalLink(url, true, title, message, 'Open Insight', 'Go back');
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
