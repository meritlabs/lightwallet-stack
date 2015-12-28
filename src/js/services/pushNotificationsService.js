 'use strict';
 angular.module('copayApp.services')
   .factory('pushNotificationsService', function($http) {
     var root = {};

     root.subscribe = function(opts) {
       return $http.post('http://192.168.1.126:8000/subscribe', opts);
     }

     root.unsubscribe = function(token) {
       return $http.post('http://192.168.1.126:8000/unsubscribe', {
         token: token
       });
     }

     return root;

   });
