### pre-requisites ###
.PHONY: prepare-prereqs
prepare-prereqs:
	npm install -g yarn
	npm install -g lerna
	npm install -g grunt

.PHONY: set-node-path
set-node-path:
	export NODE_PATH=${CURDIR}

### lightwallet-app ###
.PHONY: prepare-lightwallet-app
prepare-lightwallet-app:
	cd ./lightwallet && yarn
	cd ./lightwallet && yarn apply

.PHONY: start-lightwallet-app
start-lightwallet-app: prepare-lightwallet-app
	set-node-path
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
	cd ./libs/bitcore-node/bin && ln -sf ../../../merit-bitcoin/src/bitcoind

# Within the devnode directory with the configuration file, start the node:
.PHONY: start-bitcore-node
start-bitcore-node: symlink-bitcore-node
	./libs/bitcore-node/bin/bitcore-node start

.PHONY: start-bitcore-wallet-service
start-bitcore-wallet-service: set-node-path
	cd ./libs/bitcore-wallet-service/ && node locker/locker.js & \
	cd ./libs/bitcore-wallet-service/ && node messagebroker/messagebroker.js & \
	cd ./libs/bitcore-wallet-service/ && node bcmonitor/bcmonitor.js & \
	cd ./libs/bitcore-wallet-service/ && node fiatrateservice/fiatrateservice.js & \
	cd ./libs/bitcore-wallet-service/ && node bws.js &

.PHONY: stop-bitcore-wallet-service
stop-bitcore-wallet-service:
	cd ./libs/bitcore-wallet-service/ && sh stop.sh


.PHONY: start-lightwallet-stack
start-lightwallet-stack: set-node-path start-bitcore-wallet-service start-bitcore-node
	

.PHONY: clean-yarn
clean-yarn: 
	yarn cache clean

## Preperation Order is based on dependencies ##
.PHONY: prepare-bitcore-lib
prepare-bitcore-lib:
	cd ./libs/bitcore-lib/ && yarn

.PHONY: prepare-bitcoin-rpc
prepare-bitcoin-rpc:
	cd ./libs/bitcoin-rpc/ && yarn

.PHONY: prepare-bitcore-mnemonic
prepare-bitcore-mnemonic:
	cd ./libs/bitcore-mnemonic/ && yarn

.PHONY: prepare-insight-api
prepare-insight-api:
	cd ./libs/insight-api/ && yarn

.PHONY: prepare-insight-ui
prepare-insight-ui:
	cd ./libs/insight-ui/ && yarn
	cd ./libs/insight-ui/ && yarn run build

.PHONY: prepare-bitcore-wallet-service
prepare-bitcore-wallet-service:
	cd ./libs/bitcore-wallet-service/ && yarn

.PHONY: prepare-bitcore-wallet-client
prepare-bitcore-wallet-client:
	cd ./libs/bitcore-wallet-client/ && yarn

.PHONY: prepare-bitcore-p2p
prepare-bitcore-p2p:
	cd ./libs/bitcore-p2p/ && yarn

.PHONY: prepare-bitcore-node
prepare-bitcore-node:
	cd ./libs/bitcore-node/ && yarn

.PHONY: prepare-bitcore-message
prepare-bitcore-message:
	cd ./libs/bitcore-message/ && yarn

.PHONY: prepare-bitcore-payment-protocol
prepare-bitcore-payment-protocol:
	cd ./libs/bitcore-payment-protocol/ && yarn

## Preperation Order is based on dependencies ##
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

# Clean 
.PHONY: clean-bitcore-lib
clean-bitcore-lib:
	rm -rf ./libs/bitcore-lib/node_modules 
	rm -f ./libs/bitcore-lib/package-lock.json
	rm -f ./libs/bitcore-lib/yarn.lock

.PHONY: clean-bitcoin-rpc
clean-bitcoin-rpc:
	rm -rf ./libs/bitcoin-rpc/node_modules
	rm -f ./libs/bitcore-rpc/package-lock.json
	rm -f ./libs/bitcore-rpc/yarn.lock


.PHONY: clean-bitcore-mnemonic
clean-bitcore-mnemonic:
	rm -rf ./libs/bitcore-mnemonic/node_modules
	rm -f ./libs/bitcore-mnemonic/package-lock.json
	rm -f ./libs/bitcore-mnemonic/yarn.lock


.PHONY: clean-insight-api
clean-insight-api:
	rm -rf ./libs/libs/insight-api/node_modules
	rm -f ./libs/libs/insight-api/package-lock.json
	rm -f ./libs/libs/insight-api/yarn.lock


.PHONY: clean-insight-ui
clean-insight-ui:
	rm -rf ./libs/libs/insight-ui/node_modules
	rm -f ./libs/libs/insight-ui/package-lock.json
	rm -f ./libs/libs/insight-ui/yarn.lock


.PHONY: clean-bitcore-wallet-service
clean-bitcore-wallet-service:
	rm -rf ./libs/bitcore-wallet-service/node_modules
	rm -f ./libs/bitcore-wallet-service/package-lock.json
	rm -f ./libs/bitcore-wallet-service/yarn.lock


.PHONY: clean-bitcore-wallet-client
clean-bitcore-wallet-client:
	rm -rf ./libs/bitcore-wallet-client/node_modules
	rm -f ./libs/bitcore-wallet-client/package-lock.json
	rm -f ./libs/bitcore-wallet-client/yarn.lock


.PHONY: clean-bitcore-p2p
clean-bitcore-p2p:
	rm -rf ./libs/bitcore-p2p/node_modules
	rm -f ./libs/bitcore-p2p/package-lock.json
	rm -f ./libs/bitcore-p2p/yarn.lock


.PHONY: clean-bitcore-node
clean-bitcore-node:
	rm -rf ./libs/bitcore-node/node_modules
	rm -f ./libs/bitcore-node/package-lock.json
	rm -f ./libs/bitcore-node/yarn.lock


.PHONY: clean-bitcore-message
clean-bitcore-message:
	rm -rf ./libs/bitcore-message/node_modules
	rm -f ./libs/bitcore-message/package-lock.json
	rm -f ./libs/bitcore-message/yarn.lock


.PHONY: clean-bitcore-payment-protocol
clean-bitcore-payment-protocol:
	rm -rf ./libs/bitcore-payment-protocol/node_modules
	rm -f ./libs/bitcore-payment-protocol/package-lock.json
	rm -f ./libs/bitcore-payment-protocol/yarn.lock


.PHONY: clean-lightwallet-stack
clean-lightwallet-stack: clean-yarn \
	clean-bitcore-lib \
	clean-bitcoin-rpc \
	clean-bitcore-mnemonic \
	clean-insight-api \
	clean-insight-ui \
	clean-bitcore-wallet-service \
	clean-bitcore-wallet-client \
	clean-bitcore-p2p \
	clean-bitcore-node \
	clean-bitcore-message \
	clean-bitcore-payment-protocol

# Clean 
.PHONY: clean-lightwallet-app
clean-bitcore-lib:
	rm -rf ./lightwallet/node_modules 
	rm -f ./lightwallet/package-lock.json
	rm -f ./lightwallet/yarn.lock

