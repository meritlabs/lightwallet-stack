# Merit Development Bootstrap

## Getting started
The lightwallet development environment consists of: 
* Bitcore Wallet Service
* Bitcore-Node
* Insight-api
* (Optionally) Insight-ui

## Getting Started

Make sure the following conditions are met

- GNU/Linux x86_32/x86_64, or OSX 64bit *(for bitcoind distributed binaries)*
- Node.js v8
- ZeroMQ *(libzmq3-dev for Ubuntu/Debian or zeromq on OSX)*

* MacOS USERS WILL NEED INSTALL THE LATEST XCODE AND ALL UPDATES*

This is stably tested on Node v4.8.4

```bash
$ npm install
```



### Installing Bitcore Wallet Service

Go back to the directory where you created the folder `merit-middle-ware`

```bash
$ cd ..
$ git clone https://github.com/meritlabs/bitcore-wallet-service.git .
```

Using `npm` install the `bitcore-wallet-service` dependencies from the package.json

```bash
$ npm install
```

### Install MongoDB

Bitcore Wallet Service uses MongoDB 

MacOS Install Instructions

```bash
$ brew install mongodb
$ sudo mkdir -p /data/db
$ sudo chmod 0755 /data/db && sudo chown $USER /data/db
$ sudo chmod 0755 /data/ && sudo chown $USER /data/
```

You should be able to start the mongodb daemon without any errors or superuser.

```bash
$ mongod
```


## Getting Everything Running

Here is what needs to happen in order...

1. Start the Bitcore-Node service

2. Start the Bitcore Wallet Service

3. Make sure Insight is running

4. Launch Merit-mobile app

### Start the Bitcore-Node service

```bash
$ cd data
$ vi bitcoin.conf
```

Inside the `bitcoin.conf` file we need to add the nodes that were setup on the Azure platform.
Copy paste into `bitcoin.conf`

```
server=1
whitelist=127.0.0.1
txindex=1
addressindex=1
timestampindex=1
spentindex=1
zmqpubrawtx=tcp://127.0.0.1:28332
zmqpubhashblock=tcp://127.0.0.1:28332
rpcallowip=127.0.0.1
rpcuser=bitcoin
rpcpassword=local321
uacomment=bitcore
testnet=1
#--- Network
addnode=13.90.86.37
addnode=13.90.85.234
addnode=13.82.88.148
```


Next you can actually start the bitcore-node service

```bash
$ cd ..
$ bitcore-node start  
```

The output should start streaming to the console and look similiar to the following.

```
[2017-08-16T04:17:02.624Z] info: Using config: /Users/demetriouswilson/Documents/Ether/merit-middle-end/bitcore-node/mynode/bitcore-node.json
[2017-08-16T04:17:02.625Z] info: Using network: testnet
[2017-08-16T04:17:02.626Z] info: Starting bitcoind
[2017-08-16T04:17:02.627Z] info: Using bitcoin config file: /Users/demetriouswilson/Documents/Ether/merit-middle-end/bitcore-node/mynode/data/bitcoin.conf
[2017-08-16T04:17:02.629Z] info: Starting bitcoin process
[2017-08-16T04:17:07.662Z] info: Bitcoin Height: 17197 Percentage: 100.00
[2017-08-16T04:17:07.666Z] info: Bitcoin Daemon Ready
[2017-08-16T04:17:07.666Z] info: Starting web
[2017-08-16T04:17:07.693Z] info: Starting insight-api
[2017-08-16T04:17:07.693Z] info: Starting insight-ui
[2017-08-16T04:17:07.694Z] info: Bitcore Node ready
[2017-08-16T04:17:08.157Z] warn: ZMQ connection delay: tcp://127.0.0.1:28332
[2017-08-16T04:17:08.158Z] info: ZMQ connected to: tcp://127.0.0.1:28332
```

Make sure you don't get any ZMQ errors... if you see any ZMQ errors then you must re-install ZMQ or seek help from co-workers.
Next make a new terminal session(or new tab) and we will start the bitcore-wallet service

### Start the Bitcore Wallet Service

We need to set the config here so that it uses the bitcore-node service.

```bash
$ cd ../bitcore-wallet-service
$ vi config.js
```

* This is a copy of the entire config.js file
```javascript
var config = {
  basePath: '/bws/api',
  disableLogs: false,
  port: 3232,

  // Uncomment to make BWS a forking server
  // cluster: true,

  // Uncomment to set the number or process (will use the nr of availalbe CPUs by default)
  // clusterInstances: 4,

  // https: true,
  // privateKeyFile: 'private.pem',
  // certificateFile: 'cert.pem',
  ////// The following is only for certs which are not
  ////// trusted by nodejs 'https' by default
  ////// CAs like Verisign do not require this
  // CAinter1: '', // ex. 'COMODORSADomainValidationSecureServerCA.crt'
  // CAinter2: '', // ex. 'COMODORSAAddTrustCA.crt'
  // CAroot: '', // ex. 'AddTrustExternalCARoot.crt'

  storageOpts: {
    mongoDb: {
      uri: 'mongodb://localhost:27017/bws',
    },
  },
  lockOpts: {
    //  To use locker-server, uncomment this:
    lockerServer: {
      host: 'localhost',
      port: 3231,
    },
  },
  messageBrokerOpts: {
    //  To use message broker server, uncomment this:
    messageBrokerServer: {
      url: 'http://localhost:3380',
    },
  },
  blockchainExplorerOpts: {
    livenet: {
      provider: 'insight',
      url: 'http://localhost:3001'
    },
    testnet: {
      provider: 'insight',
      url: 'http://localhost:3001'
      // Multiple servers (in priority order)
      // url: ['http://a.b.c', 'https://test-insight.bitpay.com:443'],
    },
  },
  pushNotificationsOpts: {
    templatePath: './lib/templates',
    defaultLanguage: 'en',
    defaultUnit: 'btc',
    subjectPrefix: '',
    pushServerUrl: 'https://fcm.googleapis.com/fcm',
    authorizationKey: '',
  },
  fiatRateServiceOpts: {
    defaultProvider: 'BitPay',
    fetchInterval: 60, // in minutes
  },
  // To use email notifications uncomment this:
  // emailOpts: {
  //  host: 'localhost',
  //  port: 25,
  //  ignoreTLS: true,
  //  subjectPrefix: '[Wallet Service]',
  //  from: 'wallet-service@bitcore.io',
  //  templatePath: './lib/templates',
  //  defaultLanguage: 'en',
  //  defaultUnit: 'btc',
  //  publicTxUrlTemplate: {
  //    livenet: 'https://insight.bitpay.com/tx/{{txid}}',
  //    testnet: 'https://test-insight.bitpay.com/tx/{{txid}}',
  //  },
  //},
  //
  // To use sendgrid:
  // var sgTransport = require('nodemail-sendgrid-transport');
  // mailer:sgTransport({
  //  api_user: xxx,
  //  api_key: xxx,
  // });
};
module.exports = config;
```

With the conf file setup we now can use two scripts to `start.sh` and `stop.sh` the BWS.

To `start`

```bash
$ cd merit-middle-ware/bitcore-wallet-service/
$ sh start.sh
```

To `stop` the BWS

```bash
$ cd merit-middle-ware/bitcore-wallet-service/
$ sh stop.sh
```

When you are ready run `start.sh` upon success you will see the following.

```
Successfully started locker/locker.js. PID=37481. Logs are at logs/locker.log
Successfully started messagebroker/messagebroker.js. PID=37482. Logs are at logs/messagebroker.log
Successfully started bcmonitor/bcmonitor.js. PID=37483. Logs are at logs/bcmonitor.log
Successfully started emailservice/emailservice.js. PID=37484. Logs are at logs/emailservice.log
Successfully started pushnotificationsservice/pushnotificationsservice.js. PID=37485. Logs are at logs/pushnotificationsservice.log
Successfully started fiatrateservice/fiatrateservice.js. PID=37486. Logs are at logs/fiatrateservice.log
Successfully started bws.js. PID=37487. Logs are at logs/bws.log
```

### Make sure Insight is running

Make sure the `bitcore-node start` is still running

Open a web browser to and go to.

http://localhost:3001/insight/status


### Launch Merit-Mobile App

Change to the directory where you have cloned th `merit-mobile` codebase.

*WARNING: STILL IN PROGRESS, WE CURRENTLY DON'T KNOW THE BEST SETUP FOR THIS as of Aug 15th 2017*

We need to change the default bws.bitpay.com/bws/api to instead point to ours

Open `angular-bitcore-wallet-client/index.js`

Update the code

```diff
-  baseUrl: opts.bwsurl || 'https://bws.bitpay.com/bws/api',
+  baseUrl: 'http://localhost:3232/bws/api',
```

Open `/src/js/controllers/preferencesBwsUrl.js`

Update the urls so they no longer use the bitpay.com links

```diff
switch ($scope.bwsurl.value) {
        case 'prod':
        case 'production':
-          bws = 'https://bws.bitpay.com/bws/api'
+          bws = 'http://localhost:3232/bws/api'
           break;
        case 'sta':
        case 'staging':
-          bws = 'https://bws-staging.b-pay.net/bws/api'
+          bws = 'http://localhost:3232/bws/api'
          break;
        case 'local':
+          bws = 'http://localhost:3232/bws/api'
          break;
```

Open `src/js/services/configService.js`

```diff
     // Bitcore wallet service URL
     bws: {
-      url: 'https://bws.bitpay.com/bws/api',
+      url: 'https://localhost:3232/bws/api',
     },
```
