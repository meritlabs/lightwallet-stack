'use strict';

angular.module('copayApp.services').factory('glideraService', function($http, $log) {
  var root = {};

  var HOST;
  var REDIRECT_URI;
  var CLIENT_ID;
  var CLIENT_SECRET;

  root.init = function(network) {
    if (network == 'testnet') {
      HOST = 'https://sandbox.glidera.io';
      REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
      CLIENT_ID = '9915b6ffa6dc3baffb87135ed3873d49';
      CLIENT_SECRET = 'd74eda05b9c6a228fd5c85cfbd0eb7eb'; 
    }
    else {
      HOST = 'https://glidera.io';
      REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
      CLIENT_ID = '';
      CLIENT_SECRET = ''; 
    }
  };

  root.getOauthCodeUrl = function() {
    return HOST 
      + '/oauth2/auth?response_type=code&client_id=' 
      + CLIENT_ID 
      + '&redirect_uri='
      + REDIRECT_URI;
  };

  root.getToken = function(code, cb) {
    var req = {
      method: 'POST',
      url: HOST + '/api/v1/oauth/token',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: { 
        grant_type : 'authorization_code',
        code: code,
        client_id : CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI
      }
    };

    $http(req).then(function(data) {
      $log.info('Glidera Authorization Access Token: SUCCESS');
      return cb(null, data.data); 
    }, function(data) {
      $log.error('Glidera Authorization Access Token: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  };

  var _get = function(endpoint, token) {
    return {
      method: 'GET',
      url: HOST + '/api/v1' + endpoint,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
  };

  root.getAccessTokenPermissions = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/oauth/token', token)).then(function(data) {
      $log.info('Glidera Access Token Permissions: SUCCESS');
      return cb(null, data.data);
    }, function(data) {
      $log.error('Glidera Access Token Permissions: ERROR ' + data.statusText);
      return cb('Glidera Access Token Permissions: ERROR');
    });
  };

  root.getEmail = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/user/email', token)).then(function(data) {
      $log.info('Glidera Get Email: SUCCESS');
      return cb(null, data.data);
    }, function(data) {
      $log.error('Glidera Get Email: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  };

  root.getPersonalInfo = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/user/personalinfo', token)).then(function(data) {
      $log.info('Glidera Get Personal Info: SUCCESS');
      return cb(null, data.data);
    }, function(data) {
      $log.error('Glidera Get Personal Info: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  };

  root.getStatus = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/user/status', token)).then(function(data) {
      $log.info('Glidera User Status: SUCCESS');
      return cb(null, data.data);
    }, function(data) {
      $log.error('Glidera User Status: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  };

  root.getLimits = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/user/limits', token)).then(function(data) {
      $log.info('Glidera Transaction Limits: SUCCESS');
      return cb(null, data.data);
    }, function(data) {
      $log.error('Glidera Transaction Limits: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  };

  root.getTransactions = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/transaction', token)).then(function(data) {
      $log.info('Glidera Transactions: SUCCESS');
      return cb(null, data.data.transactions);
    }, function(data) {
      $log.error('Glidera Transactions: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  };

  root.getTransaction = function(token, txid, cb) {
    if (!token) return cb('Invalid Token');
    if (!txid) return cb('TxId required');
    $http(_get('/transaction/' + txid, token)).then(function(data) {
      $log.info('Glidera Transaction: SUCCESS');
      return cb(null, data.data);
    }, function(data) {
      $log.error('Glidera Transaction: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  };

  root.getSellAddress = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/user/create_sell_address', token)).then(function(data) {
      $log.info('Glidera Create Sell Address: SUCCESS');
      return cb(null, data.data.sellAddress);
    }, function(data) {
      $log.error('Glidera Create Sell Address: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  };

  root.get2faCode = function(token, cb) {
    if (!token) return cb('Invalid Token');
    $http(_get('/authentication/get2faCode', token)).then(function(data) {
      $log.info('Glidera Sent 2FA code by SMS: SUCCESS');
      return cb(null, data.status == 200 ? true : false);
    }, function(data) {
      $log.error('Glidera Sent 2FA code by SMS: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  };

  var _post = function(endpoint, token, twoFaCode, data) {
    return {
      method: 'POST',
      url: HOST + '/api/v1' + endpoint,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        '2FA_CODE': twoFaCode
      },
      data: data
    };
  };

  root.sellPrice = function(token, price, cb) {
    var data = {
      qty: price.qty,
      fiat: price.fiat
    };
    $http(_post('/prices/sell', token, null, data)).then(function(data) {
      $log.info('Glidera Sell Price: SUCCESS');
      return cb(null, data.data); 
    }, function(data) {
      $log.error('Glidera Sell Price: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  }; 

  root.sell = function(token, twoFaCode, data, cb) {
    var data = {
      refundAddress: data.refundAddress,
      signedTransaction: data.signedTransaction,
      priceUuid: data.priceUuid,
      useCurrentPrice: data.useCurrentPrice,
      ip: data.ip
    };
    $http(_post('/sell', token, twoFaCode, data)).then(function(data) {
      $log.info('Glidera Sell: SUCCESS');
      return cb(null, data.data); 
    }, function(data) {
      $log.error('Glidera Sell: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  };

  root.buyPrice = function(token, price, cb) {
    var data = {
      qty: price.qty,
      fiat: price.fiat
    };
    $http(_post('/prices/buy', token, null, data)).then(function(data) {
      $log.info('Glidera Buy Price: SUCCESS');
      return cb(null, data.data); 
    }, function(data) {
      $log.error('Glidera Buy Price: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  };

  root.buy = function(token, twoFaCode, data, cb) {
    var data = {
      destinationAddress: data.destinationAddress,
      qty: data.qty,
      priceUuid: data.priceUuid,
      useCurrentPrice: data.useCurrentPrice,
      ip: data.ip
    };
    $http(_post('/buy', token, twoFaCode, data)).then(function(data) {
      $log.info('Glidera Buy: SUCCESS');
      return cb(null, data.data); 
    }, function(data) {
      $log.error('Glidera Buy: ERROR ' + data.statusText);
      return cb(data.statusText);
    });
  };

  return root;

});
