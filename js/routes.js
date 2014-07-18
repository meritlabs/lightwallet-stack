'use strict';

//Setting up route
angular
  .module('copayApp')
  .config(function($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/signin.html',
        validate: false
      })
      .when('/signin', {
        templateUrl: 'views/signin.html',
        validate: false
      })
      .when('/import', {
        templateUrl: 'views/import.html',
        validate: false
      })
      .when('/setup', {
        templateUrl: 'views/setup.html',
        validate: false
      })
      .when('/addresses', {
        templateUrl: 'views/addresses.html',
        validate: true
      })
      .when('/transactions', {
        templateUrl: 'views/transactions.html',
        validate: true
      })
      .when('/send', {
        templateUrl: 'views/send.html',
        validate: true
      })
      .when('/backup', {
        templateUrl: 'views/backup.html',
        validate: true
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        validate: false
      })
      .when('/unsupported', {
        templateUrl: 'views/unsupported.html'
      })
      .when('/uri-payment/:data', {
        templateUrl: 'views/uri-payment.html'
      })
      .otherwise({
        templateUrl: 'views/errors/404.html',
        title: 'Error'
      });
  });

//Setting HTML5 Location Mode
angular
  .module('copayApp')
  .config(function($locationProvider) {
    $locationProvider
      .html5Mode(true)
      .hashPrefix('!');
  })
  .run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (!util.supports.data) {
        $location.path('unsupported');
      } else {
        if ((!$rootScope.wallet || !$rootScope.wallet.id) && next.validate) {
          $location.path('signin');
        }
      }
    });
  })
  .config(function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|chrome-extension|resource):/);
  });
