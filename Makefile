.PHONY: prepare
prepare:
	cd ./bitcore-wallet-client
	npm i
	cd ..
	cd ./lightwallet
	yarn apply
	yarn
	cd ..

.PHONY: start
start: prepare
	cd ./lightwallet
	yarn start
	cd ..

.PHONY: start-mongo
start-mongo:
	mongod --fork --syslog

.PHONY: stop-mongo
stop-mongo:
	kill `pgrep mongo`

.PHONY: start-bitcore-node
start-bitcore-node:
	#todo

.PHONY: stop-bitcore-node
stop-bitcore-node:
	#todo

.PHONY: start-bitcore-wallet-service
start-bitcore-wallet-service:
	cd ./bitcore-wallet-service/ && sh start.sh

.PHONY: stop-bitcore-wallet-service
stop-bitcore-wallet-service:
	cd ./bitcore-wallet-service/ && sh stop.sh

.PHONY: clean-yarn
clean-yarn: 
	yarn cache clean

# Preperation Order is based on dependencies
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
prepare-lightwallet-stack: clean-yarn prepare-bitcore-lib prepare-bitcoin-rpc prepare-bitcore-mnemonic prepare-insight-api prepare-bitcore-wallet-service prepare-bitcore-wallet-client prepare-bitcore-p2p prepare-bitcore-node prepare-bitcore-message prepare-bitcore-payment-protocol
