### lightwallet-app ###

.PHONY: prepare-lightwallet-app
prepare-lightwallet-app:
	cd ./lightwallet && yarn
	cd ./lightwallet && yarn apply

.PHONY: start-lightwallet-app
start-lightwallet-app: prepare-lightwallet-app
	cd ./lightwallet && yarn start

### lightwallet-stack ###

.PHONY: start-mongo
start-mongo:
	mongod --fork --syslog

.PHONY: stop-mongo
stop-mongo:
	kill `pgrep mongo`

# Symlink the Bitcoin bitcoind
# See https://github.com/meritlabs/lightwallet-stack/blob/master/bitcore-node/docs/development.md
.PHONY: symlink-bitcore-node
symlink-bitcore-node:
	cd ./bitcore-node/bin && ln -sf ../../../merit-bitcoin/src/bitcoind

# Create `devnode` directory, copy over settings and symlink services
# See https://github.com/meritlabs/lightwallet-stack/blob/master/bitcore-node/docs/development.md
.PHONY: prepare-bitcore-node-devnode
prepare-bitcore-node-devnode:
	rm -Rf ./bitcore-node/devnode
	mkdir ./bitcore-node/devnode
	mkdir ./bitcore-node/devnode/node_modules
	mkdir ./bitcore-node/devnode/data/
	cp bitcore-node-json2.json ./bitcore-node/devnode/bitcore-node.json
	cp bitcore-node-devnode-data-bitcoin.conf ./bitcore-node/devnode/data/bitcoin.conf
	touch ./bitcore-node/devnode/package.json
	cd ./bitcore-node/devnode/node_modules/ && ln -sf ../../../bitcore-lib
	cd ./bitcore-node/devnode/node_modules/ && ln -sf ../../../bitcore-node
	cd ./bitcore-node/devnode/node_modules/ && ln -sf ../../../insight-api
	cd ./bitcore-node/devnode/node_modules/ && ln -sf ../../../insight-ui

# Within the devnode directory with the configuration file, start the node:
.PHONY: start-bitcore-node
start-bitcore-node:
	cd ./bitcore-node/devnode && ../bin/bitcore-node start &

.PHONY: start-bitcore-wallet-service
start-bitcore-wallet-service:
	cd ./bitcore-wallet-service/ && node locker/locker.js & \
	cd ./bitcore-wallet-service/ && node messagebroker/messagebroker.js & \
	cd ./bitcore-wallet-service/ && node bcmonitor/bcmonitor.js & \
	cd ./bitcore-wallet-service/ && node fiatrateservice/fiatrateservice.js & \
	cd ./bitcore-wallet-service/ && node bws.js

.PHONY: stop-bitcore-wallet-service
stop-bitcore-wallet-service:
	cd ./bitcore-wallet-service/ && sh stop.sh

.PHONY: clean-yarn
clean-yarn: 
	yarn cache clean

## Preperation Order is based on dependencies ##
.PHONY: prepare-bitcore-lib
prepare-bitcore-lib:
	cd ./bitcore-lib/ && yarn

.PHONY: prepare-bitcoin-rpc
prepare-bitcoin-rpc:
	cd ./bitcoin-rpc/ && yarn

.PHONY: prepare-bitcore-mnemonic
prepare-bitcore-mnemonic:
	cd ./bitcore-mnemonic/ && yarn

.PHONY: prepare-insight-api
prepare-insight-api:
	cd ./insight-api/ && yarn

.PHONY: prepare-insight-ui
prepare-insight-ui:
	cd ./insight-ui/ && yarn
	cd ./insight-ui/ && yarn run build

.PHONY: prepare-bitcore-wallet-service
prepare-bitcore-wallet-service:
	cd ./bitcore-wallet-service/ && yarn

.PHONY: prepare-bitcore-wallet-client
prepare-bitcore-wallet-client:
	cd ./bitcore-wallet-client/ && yarn

.PHONY: prepare-bitcore-p2p
prepare-bitcore-p2p:
	cd ./bitcore-p2p/ && yarn

.PHONY: prepare-bitcore-node
prepare-bitcore-node:
	cd ./bitcore-node/ && yarn

.PHONY: prepare-bitcore-message
prepare-bitcore-message:
	cd ./bitcore-message/ && yarn

.PHONY: prepare-bitcore-payment-protocol
prepare-bitcore-payment-protocol:
	cd ./bitcore-payment-protocol/ && yarn

.PHONY: prepare-lightwallet-stack
prepare-lightwallet-stack: clean-yarn \
	prepare-bitcore-lib \
	prepare-bitcoin-rpc \
	prepare-bitcore-mnemonic \
	prepare-insight-api \
	prepare-insight-ui \
	prepare-bitcore-wallet-service \
	prepare-bitcore-wallet-client \
	prepare-bitcore-p2p \
	prepare-bitcore-node \
	prepare-bitcore-message \
	prepare-bitcore-payment-protocol

.PHONY: start-lightwallet-stack
start-lightwallet-stack: start-bitcore-node \
	start-bitcore-wallet-service
	
