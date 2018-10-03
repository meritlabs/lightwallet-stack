# Peer-to-Peer
The `merit-p2p` module provides peer-to-peer networking capabilities for LWS, and includes [Peer](peer.md) and [Pool](pool.md) classes. A [Message](messages.md) class is also exposed, in addition to [several types of messages](messages.md). Pool will maintain connection to several peers, Peers represents a node in the Merit network, and Message represents data sent to and from a Peer. For detailed technical information about the Merit protocol.

## Installation
Peer-to-peer is implemented as a separate module, that is shipped with Merit Lightwallet Stack.

For node projects:

```bash
npm install merit-p2p --save
```

## Quick Start

```javascript
var Peer = require('merit-p2p').Peer;
var peer = new Peer({host: '5.9.85.34'});

// handle events
peer.on('inv', function(message) {
  // message.inventory[]
});

peer.connect();
```
