# Meritcore P2P

Merit P2P prottocol library.

## Getting Started

```sh
npm install merit-p2p
```

In order to connect to the Merit network, you'll need to know the IP address of at least one node of the network, or use pool to discover peers using a DNS seed.

```javascript
var Peer = require('merit-p2p').Peer;

var peer = new Peer({ host: '127.0.0.1' });

peer.on('ready', function() {
  // peer info
  console.log(peer.version, peer.subversion, peer.bestHeight);
});
peer.on('disconnect', function() {
  console.log('connection closed');
});
peer.connect();
```

Then, you can get information from other peers by using:

```javascript
// handle events
peer.on('inv', function(message) {
  // message.inventory[]
});
peer.on('tx', function(message) {
  // message.transaction
});
```

## Contributing

Please, check out our [Contribution guide](https://github.com/meritlabs/lightwallet-stack/blob/master/CONTRIBUTING.md) and [Code of Conduct](https://github.com/meritlabs/lightwallet-stack/blob/master/CODE_OF_CONDUCT.md).

## License

**Code released under [the MIT license](https://github.com/meritlabs/lightwallet-stack/blob/master/LICENSE).**

Copyright (C) 2013 - 2017 BitPay, Inc.
Copyright (C) 2017 - 2018 The Merit Foundation.
