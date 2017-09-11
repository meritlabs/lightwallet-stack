# Merit Development Bootstrap

## Getting started
The lightwallet development environment consists of: 
* Bitcore Wallet Service
* Bitcore-Node
* Insight-api
* (Optionally) Insight-ui

## Prerequisites

Make sure the following conditions are met

- GNU/Linux x86_32/x86_64, or OSX 64bit *(for bitcoind distributed binaries)*
- ZeroMQ *(libzmq3-dev for Ubuntu/Debian or zeromq on OSX)*
- GNU Make version 4.2.1
- The lightwallet-stack stably tested on Node.js >= v4.8.4

### MacOS Users
* MacOS USERS WILL NEED INSTALL THE LATEST XCODE AND ALL UPDATES

Read [https://github.com/meritlabs/merit-bitcoin/blob/master/doc/build-osx.md](https://github.com/meritlabs/merit-bitcoin/blob/master/doc/build-osx.md)

- Install `gmake` [http://braumeister.org/repos/Homebrew/homebrew-core/formula/make](http://braumeister.org/repos/Homebrew/homebrew-core/formula/make)

```sh
brew install make
```

- Alias your system `make` to use `gmake` or add `gmake` to your path.

```sh
# ~/.bash_profile

alias make='/usr/local/Cellar/make/4.2.1_1/bin/gmake'
```

### Install Lerna

You need Lerna to manage cross dependencies while still allowing us to publish packages.
```bash
npm install -g lerna
```


### Install MongoDB

Bitcore Wallet Service uses MongoDB 

```bash
$ brew install mongodb
$ sudo mkdir -p /data/db
$ sudo chmod 0755 /data/db && sudo chown $USER /data/db
$ sudo chmod 0755 /data/ && sudo chown $USER /data/
```

### Starting and Stopping MongoDB

```sh
cd merit-labs/lightwallet-stack/
make start-mongo
make stop-mongo
```

### Setup LightWallet-Stack

Run these in the order listed. 

```sh
lerna bootstrap
make symlink-bitcore-node
make start-lightwallet-stack
```

### Run LightWallet-App

```sh
make start-lightwallet-app
```

### Start Bitcore Individually

```sh
make start-bitcore-node
```

## Send an RPC call to the Lightwallet bitcore-node

- `make start-bitcore-node` should be running
- `make symlink-bitcore-node` should be symlinked

```sh
cd merit-labs/lightwallet-stack/
./bitcore-node/bitcore-node/bin/bitcore-node call {bitcore-node/lib/services/bitcoind.js rpc_command_here}
```
