'use strict';

var copay = require('copay');
var _ = require('lodash');
var LS = require('../js/plugins/LocalStorage');
var ls = new LS();


// TODO move this to configService !
var config = copay.defaultConfig;

ls.getItem('config', function(err, data) {
  var localConfig;
  try {
  localConfig = JSON.parse(data);
  } catch(e) {};
  if (localConfig) {
    var cmv = copay.version.split('.')[1];
    var lmv = localConfig.version ? localConfig.version.split('.')[1] : '-1';
    if (cmv === lmv) {
      _.each(localConfig, function(value, key) {
        config[key] = value;
      });
    }
  }
});

var modules = [
  'ngRoute',
  'angularMoment',
  'mm.foundation',
  'monospaced.qrcode',
  'ngIdle',
  'gettext',
  'ui.gravatar',
  'ngTouch',
  'copayApp.filters',
  'copayApp.services',
  'copayApp.controllers',
  'copayApp.directives',
];

var copayApp = window.copayApp = angular.module('copayApp', modules);

var defaults = JSON.parse(JSON.stringify(copay.defaultConfig));
copayApp.value('defaults', defaults);

copayApp.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'mailto:**'
  ]);
});

angular.module('ui.gravatar').config([
  'gravatarServiceProvider',
  function(gravatarServiceProvider) {
    gravatarServiceProvider.defaults = {
      size: 35
    };
    // Use https endpoint
    gravatarServiceProvider.secure = true;
  }
]);

angular.module('copayApp.filters', []);
angular.module('copayApp.services', []);
angular.module('copayApp.controllers', []);
angular.module('copayApp.directives', []);
