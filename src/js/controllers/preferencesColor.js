'use strict';

angular.module('copayApp.controllers').controller('preferencesColorController',
  function($scope, $timeout, $log, configService, profileService, go) {
    var config = configService.getSync();
    this.colorOpts = [
      '#DD4B39',
      '#F38F12',
      '#FAA77F',
      '#D0B136',
      '#9EDD72',
      '#77DADA',
      '#4A90E2',
      '#484ED3',
      '#9B59B6',
      '#E856EF',
      '#FF599E',
      '#7A8C9E',
    ];

    var fc = profileService.focusedClient;
    var walletId = fc.credentials.walletId;

    var config = configService.getSync();
    config.colorFor = config.colorFor || {};
    this.color = config.colorFor[walletId] || '#4A90E2';

    this.save = function(color) {
      var self = this;
      var opts = {
        colorFor: {}
      };
      opts.colorFor[walletId] = color;

      configService.set(opts, function(err) {
        if (err) $log.warn(err);
        go.preferences();
        $scope.$emit('Local/ColorUpdated');
        $timeout(function() {
          $scope.$apply();
        }, 100);
      });

    };
  });
