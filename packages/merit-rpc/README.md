# meritd-rpc.js

A client library to connect to Merit Core RPC in JavaScript.

## Get Started

meritd-rpc.js runs on [node](http://nodejs.org/) and is installed with Lightwallet Stack:

## Examples

```javascript
var run = function() {
  var meritcore = require('meritcore-lib');
  var RpcClient = require('meritd-rpc');

  var config = {
    protocol: 'http',
    user: 'user',
    pass: 'pass',
    host: '127.0.0.1',
    port: '18445',
  };

  var rpc = new RpcClient(config);

  var txids = [];

  function showNewTransactions() {
    rpc.getRawMemPool(function(err, ret) {
      if (err) {
        console.error(err);
        return setTimeout(showNewTransactions, 10000);
      }

      function batchCall() {
        ret.result.forEach(function(txid) {
          if (txids.indexOf(txid) === -1) {
            rpc.getRawTransaction(txid);
          }
        });
      }

      rpc.batch(batchCall, function(err, rawtxs) {
        if (err) {
          console.error(err);
          return setTimeout(showNewTransactions, 10000);
        }

        rawtxs.map(function(rawtx) {
          var tx = new meritcore.Transaction(rawtx.result);
          console.log('\n\n\n' + tx.id + ':', tx.toObject());
        });

        txids = ret.result;
        setTimeout(showNewTransactions, 2500);
      });
    });
  }

  showNewTransactions();
};
```

## Contributing

Please, check out our [Contribution guide](https://github.com/meritlabs/lightwallet-stack/blob/master/CONTRIBUTING.md) and [Code of Conduct](https://github.com/meritlabs/lightwallet-stack/blob/master/CODE_OF_CONDUCT.md).

## License

**Code released under [the MIT license](https://github.com/meritlabs/lightwallet-stack/blob/master/LICENSE).**

Copyright (C) 2013 - 2017 BitPay, Inc.
Copyright (c) 2017 - 2021 The Merit Foundation.
