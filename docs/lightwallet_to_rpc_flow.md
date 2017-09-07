## Merit Lightwallet to MeritD via RPC Overview

The goal is of this document is to explain the process of exposing a new Bitcoin RPC 
endpoint to the Bitcore-Wallet via the Insight-API and Bitcore-node. 

The development flow is the following...

| Merit Repo   | Purpose                                                                                      |
|--------------|----------------------------------------------------------------------------------------------|
| Bitcoind-rpc | Add the name of the new RPC call and the list of parameter types to the `RpcClient.callspec` |
| Bitcore-node | Add new RPC call to bitcoind `getAPIMethods` array                                           |
| Bitcore-node | Implement the RPC call as a new method                                                       |
| Insight-API  | Add new HTTP route                                                                           |
| Insight-API  | Add new controller or update controller for HTTP route                                       |
| Insight-API  | Call `service.bitcoind.myNewMethod` from within controller                                   |

Testing flow

- Make sure our merit-bitcoin bitcoind is being used by bitcore-node via symlink
  - Start bitcore-node
- Start Bitcore-wallet-service (make sure Bitcore-wallet-client is correct)
  - Start Merit-mobile and make the API call to the wallet service

## Development Flow Example "getBlockHeader" 

### Add the RPC Call name and parameter types to the bitcoind-rpc CallSpec List

  ```javascript
  // bitcoind-rpc/lib/index.js
  RpcClient.callspec = {
    // Some examples... the real list is longer
    addNode: '', // Example of rpc method with zero arguments
    getBlockHeader: 'str', // Rpc methods needs one typed argument
  };
```

https://bitcoin.org/en/developer-reference#getblockheader

### Start by defining your RPC call in `bitcore-node/lib/services/bitcoind.js` [bitcore-node/lib/services/bitcoind.js](https://github.com/meritlabs/bitcore-node/blob/v3.1.3/lib/services/bitcoind.js)

Note that these RPC calls are based on the Bitcoin C++ RPC https://bitcoin.org/en/developer-reference#rpcs

*The number at the end of the array is the `number of arguments` the function accepts.*

```javascript
// bitcore-node/lib/services/bitcoind.js
Bitcoin.prototype.getAPIMethods = function() {
  var methods = [
    ['getBlock', this, this.getBlock, 1],
    ['getRawBlock', this, this.getRawBlock, 1],
    ['getBlockHeader', this, this.getBlockHeader, 1],
    ['getBlockOverview', this, this.getBlockOverview, 1],
    ['getBlockHashesByTimestamp', this, this.getBlockHashesByTimestamp, 2],
    ['getBestBlockHash', this, this.getBestBlockHash, 0],
    ['getSpentInfo', this, this.getSpentInfo, 1],
    ['getInfo', this, this.getInfo, 0],
    ['syncPercentage', this, this.syncPercentage, 0],
    ['isSynced', this, this.isSynced, 0],
    ['getRawTransaction', this, this.getRawTransaction, 1],
    ['getTransaction', this, this.getTransaction, 1],
    ['getDetailedTransaction', this, this.getDetailedTransaction, 1],
    ['sendTransaction', this, this.sendTransaction, 1],
    ['estimateFee', this, this.estimateFee, 1],
    ['getAddressTxids', this, this.getAddressTxids, 2],
    ['getAddressBalance', this, this.getAddressBalance, 2],
    ['getAddressUnspentOutputs', this, this.getAddressUnspentOutputs, 2],
    ['getAddressHistory', this, this.getAddressHistory, 2],
    ['getAddressSummary', this, this.getAddressSummary, 1],
    ['generateBlock', this, this.generateBlock, 1]
      ];
    return methods;
};
```

### Add the implementation method within the same file as a `Bitcoin.prototype`

For example, look at the `getBlockHeader` RPC call.
In the Bitcoin C++ RPC its defined here https://bitcoin.org/en/developer-reference#getblockheader

```javascript
// bitcore-node/lib/services/bitcoind.js
Bitcoin.prototype.getBlockHeader = function(blockArg, callback) {
  var self = this;
  // The rest of the code goes here
}
```

### Add new HTTP route to the Insight-API, the BWS should call this endpoint

[insight-api/lib/index.js](https://github.com/meritlabs/insight-api/blob/master/lib/index.js)

Every route does the following

- Loads a Controller object
- defines the HTTP verb
- binds a method

```javascript
InsightAPI.prototype.setupRoutes = function(app) {
  // Some Other code above...

  // Block routes
  var blocks = new BlockController(blockOptions);
  app.get('/blocks', this.cacheShort(), blocks.list.bind(blocks));

  app.get('/block/:blockHash', this.cacheShort(), blocks.checkBlockHash.bind(blocks), blocks.show.bind(blocks));
  app.param('blockHash', blocks.block.bind(blocks));

  app.get('/rawblock/:blockHash', this.cacheLong(), blocks.checkBlockHash.bind(blocks), blocks.showRaw.bind(blocks));
  app.param('blockHash', blocks.rawBlock.bind(blocks));

  app.get('/block-index/:height', this.cacheShort(), blocks.blockIndex.bind(blocks));
  app.param('height', blocks.blockIndex.bind(blocks));

  // Some Other code below....
}
```

### Go into the Insight-API controller that your HTTP route uses and make the service call to bitcoind [insight-api/lib/blocks](https://github.com/meritlabs/insight-api/blob/master/lib/blocks.js)

The actual call to the bitcoind is made via `self.node.services.bitcoind`

```javascript
/**
 * Find block by hash ...
 */
BlockController.prototype.block = function(req, res, next) {
  // some other code...
  if (blockCached) {
    // some other code...
  } else {
    self.node.services.bitcoind.getBlockHeader(hash, function(err, info) {
      // callback code...
    });
  }
};
```
