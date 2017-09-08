### pre-requisites ###
.PHONY: prepare-prereqs
prepare-prereqs:
	npm install -g yarn
	npm install -g lerna
	npm install -g grunt

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

# Within the devnode directory with the configuration file, start the node:
.PHONY: start-bitcore-node
start-bitcore-node:
	./bitcore-node/bin/bitcore-node start

.PHONY: start-bitcore-wallet-service
start-bitcore-wallet-service:
	cd ./bitcore-wallet-service/ && node locker/locker.js & \
	cd ./bitcore-wallet-service/ && node messagebroker/messagebroker.js & \
	cd ./bitcore-wallet-service/ && node bcmonitor/bcmonitor.js & \
	cd ./bitcore-wallet-service/ && node fiatrateservice/fiatrateservice.js & \
	cd ./bitcore-wallet-service/ && node bws.js &

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
start-lightwallet-stack: start-bitcore-wallet-service \
	start-bitcore-node
	

# Clean 
## Preperation Order is based on dependencies ##
.PHONY: clean-bitcore-lib
clean-bitcore-lib:
	rm -rf ./bitcore-lib/node_modules 
	rm -f ./bitcore-lib/package-lock.json
	rm -f ./bitcore-lib/yarn.lock

.PHONY: clean-bitcoin-rpc
clean-bitcoin-rpc:
	rm -rf ./bitcoin-rpc/node_modules
	rm -f ./bitcore-rpc/package-lock.json
	rm -f ./bitcore-rpc/yarn.lock


.PHONY: clean-bitcore-mnemonic
clean-bitcore-mnemonic:
	rm -rf ./bitcore-mnemonic/node_modules
	rm -f ./bitcore-mnemonic/package-lock.json
	rm -f ./bitcore-mnemonic/yarn.lock


.PHONY: clean-insight-api
clean-insight-api:
	rm -rf ./insight-api/node_modules
	rm -f ./insight-api/package-lock.json
	rm -f ./insight-api/yarn.lock


.PHONY: clean-insight-ui
clean-insight-ui:
	rm -rf ./insight-ui/node_modules
	rm -f ./insight-ui/package-lock.json
	rm -f ./insight-ui/yarn.lock


.PHONY: clean-bitcore-wallet-service
clean-bitcore-wallet-service:
	rm -rf ./bitcore-wallet-service/node_modules
	rm -f ./bitcore-wallet-service/package-lock.json
	rm -f ./bitcore-wallet-service/yarn.lock


.PHONY: clean-bitcore-wallet-client
clean-bitcore-wallet-client:
	rm -rf ./bitcore-wallet-client/node_modules
	rm -f ./bitcore-wallet-client/package-lock.json
	rm -f ./bitcore-wallet-client/yarn.lock


.PHONY: clean-bitcore-p2p
clean-bitcore-p2p:
	rm -rf ./bitcore-p2p/node_modules
	rm -f ./bitcore-p2p/package-lock.json
	rm -f ./bitcore-p2p/yarn.lock


.PHONY: clean-bitcore-node
clean-bitcore-node:
	rm -rf ./bitcore-node/node_modules
	rm -f ./bitcore-node/package-lock.json
	rm -f ./bitcore-node/yarn.lock


.PHONY: clean-bitcore-message
clean-bitcore-message:
	rm -rf ./bitcore-message/node_modules
	rm -f ./bitcore-message/package-lock.json
	rm -f ./bitcore-message/yarn.lock


.PHONY: clean-bitcore-payment-protocol
clean-bitcore-payment-protocol:
	rm -rf ./bitcore-payment-protocol/node_modules
	rm -f ./bitcore-payment-protocol/package-lock.json
	rm -f ./bitcore-payment-protocol/yarn.lock


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
