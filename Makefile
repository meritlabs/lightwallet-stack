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
	cd ./packages/bitcore-node/bin && ln -sf ../../../merit-bitcoin/src/bitcoind

# Within the devnode directory with the configuration file, start the node:
.PHONY: start-bitcore-node
start-bitcore-node:
	./packages/bitcore-node/bin/bitcore-node start

.PHONY: start-bitcore-wallet-service
start-bitcore-wallet-service:
	cd ./packages/bitcore-wallet-service/ && node locker/locker.js & \
	cd ./packages/bitcore-wallet-service/ && node messagebroker/messagebroker.js & \
	cd ./packages/bitcore-wallet-service/ && node bcmonitor/bcmonitor.js & \
	cd ./packages/bitcore-wallet-service/ && node fiatrateservice/fiatrateservice.js & \
	cd ./packages/bitcore-wallet-service/ && node bws.js &

.PHONY: stop-bitcore-wallet-service
stop-bitcore-wallet-service:
	cd ./packages/bitcore-wallet-service/ && sh stop.sh

.PHONY: clean-yarn
clean-yarn: 
	yarn cache clean

## Preperation Order is based on dependencies ##
.PHONY: prepare-bitcore-lib
prepare-bitcore-lib:
	cd ./packages/bitcore-lib/ && yarn

.PHONY: prepare-bitcoin-rpc
prepare-bitcoin-rpc:
	cd ./packages/bitcoin-rpc/ && yarn

.PHONY: prepare-bitcore-mnemonic
prepare-bitcore-mnemonic:
	cd ./packages/bitcore-mnemonic/ && yarn

.PHONY: prepare-insight-api
prepare-insight-api:
	cd ./packages/insight-api/ && yarn

.PHONY: prepare-insight-ui
prepare-insight-ui:
	cd ./packages/insight-ui/ && yarn
	cd ./packages/insight-ui/ && yarn run build

.PHONY: prepare-bitcore-wallet-service
prepare-bitcore-wallet-service:
	cd ./packages/bitcore-wallet-service/ && yarn

.PHONY: prepare-bitcore-wallet-client
prepare-bitcore-wallet-client:
	cd ./packages/bitcore-wallet-client/ && yarn

.PHONY: prepare-bitcore-p2p
prepare-bitcore-p2p:
	cd ./packages/bitcore-p2p/ && yarn

.PHONY: prepare-bitcore-node
prepare-bitcore-node:
	cd ./packages/bitcore-node/ && yarn

.PHONY: prepare-bitcore-message
prepare-bitcore-message:
	cd ./packages/bitcore-message/ && yarn

.PHONY: prepare-bitcore-payment-protocol
prepare-bitcore-payment-protocol:
	cd ./packages/bitcore-payment-protocol/ && yarn

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
start-lightwallet-stack: start-bitcore-wallet-service \
	start-bitcore-node
	
