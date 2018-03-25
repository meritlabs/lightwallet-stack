### pre-requisites ###
.PHONY: prepare-prereqs
prepare-prereqs:
	npm install -g npm
	npm install -g lerna
	npm install -g grunt
	npm install -g cordova
	npm install -g ionic

### lightwallet-app ###
.PHONY: prepare-lightwallet
prepare-lightwallet:
	lerna bootstrap
	cd ./packages/lightwallet/mobile/ && mkdir -p www && cordova platform add android && cordova prepare android
	cd ./packages/lightwallet/mobile/ && cordova platform add ios && cordova prepare ios

.PHONY: start-lightwallet
start-lightwallet:
	cd ./packages/lightwallet && ionic serve

.PHONY: start-desktop-lightwallet
start-desktop-lightwallet:
	cd ./packages/lightwallet/desktop && npm run start

.PHONY: clean-lightwallet
clean-lightwallet:
	rm -rf ./packages/lightwallet/mobile/platforms
	rm -rf ./packages/lightwallet/mobile/plugins
	rm -rf ./packages/lightwallet/desktop/node_modules
	rm -rf ./packages/lightwallet/mobile/node_modules
	rm -rf ./packages/lightwallet/node_modules


### lightwallet-stack ###

.PHONY: start-mongo
start-mongo:
	mongod --fork --syslog

.PHONY: stop-mongo
stop-mongo:
	kill `pgrep mongo`

# Symlink the Merit meritd
# See https://github.com/meritlabs/lightwallet-stack/blob/master/bitcore-node/docs/development.md
.PHONY: symlink-bitcore-node
symlink-bitcore-node:
	cd ./packages/bitcore-node/bin && ln -sf ../../../merit/src/meritd

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
	cd ./packages/bitcore-wallet-service/ && node bws.js & \
	cd ./packages/bitcore-wallet-service/ && node pushnotificationsservice/pushnotificationsservice.js & \
	cd ./packages/bitcore-wallet-service/ && node emailservice/emailservice.js

.PHONY: stop-bitcore-wallet-service
stop-bitcore-wallet-service:
	cd ./packages/bitcore-wallet-service/ && sh stop.sh

.PHONY: clean-npm
clean-npm:
	npm cache clean --force

.PHONY: prepare-stack
prepare-stack: clean-npm \
	use-lerna

.PHONY: prepare-procuction-stack
prepare-production-stack: clean-npm \
	use-lerna-production

.PHONY: use-lerna
use-lerna:
	lerna bootstrap

.PHONY: use-lerna-production
use-lerna-production:
	lerna bootstrap -- --production --no-optional

.PHONY: start-stack
start-stack: symlink-bitcore-node start-bitcore-node


# Clean
## Preperation Order is based on dependencies ##
.PHONY: clean-bitcore-lib
clean-bitcore-lib:
	rm -rf ./packages/bitcore-lib/node_modules

.PHONY: clean-bitcoin-rpc
clean-bitcoin-rpc:
	rm -rf ./packages/bitcoin-rpc/node_modules

.PHONY: clean-bitcore-mnemonic
clean-bitcore-mnemonic:
	rm -rf ./packages/bitcore-mnemonic/node_modules

.PHONY: clean-insight-api
clean-insight-api:
	rm -rf ./packages/insight-api/node_modules

.PHONY: clean-insight-ui
clean-insight-ui:
	rm -rf ./packages/insight-ui/node_modules

.PHONY: clean-bitcore-wallet-service
clean-bitcore-wallet-service:
	rm -rf ./packages/bitcore-wallet-service/node_modules

.PHONY: clean-bitcore-wallet-client
clean-bitcore-wallet-client:
	rm -rf ./packages/bitcore-wallet-client/node_modules

.PHONY: clean-bitcore-p2p
clean-bitcore-p2p:
	rm -rf ./packages/bitcore-p2p/node_modules

.PHONY: clean-bitcore-node
clean-bitcore-node:
	rm -rf ./packages/bitcore-node/node_modules

.PHONY: clean-bitcore-message
clean-bitcore-message:
	rm -rf ./packages/bitcore-message/node_modules

.PHONY: clean-bitcore-payment-protocol
clean-bitcore-payment-protocol:
	rm -rf ./packages/bitcore-payment-protocol/node_modules

.PHONY: clean-stack
clean-stack: clean-npm \
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
	clean-bitcore-payment-protocol \
	clean-lightwallet

.PHONY: test-bitcoin-rpc
test-bitcoin-rpc:
	cd packages/bitcoin-rpc && npm test

.PHONY: test-bitcore-lib
test-bitcore-lib:
	cd packages/bitcore-lib && npm test

.PHONY: test-bitcore-message
test-bitcore-message:
	cd packages/bitcore-message && npm test

.PHONY: test-bitcore-mnemonic
test-bitcore-mnemonic:
	cd packages/bitcore-mnemonic && npm test

.PHONY: test-bitcore-node
test-bitcore-node:
	cd packages/bitcore-node && npm test

.PHONY: test-bitcore-p2p
test-bitcore-p2p:
	cd packages/bitcore-p2p && npm test

.PHONY: test-bitcore-payment-protocol
test-bitcore-payment-protocol:
	cd packages/bitcore-payment-protocol && npm test

.PHONY: test-bitcore-wallet-service
test-bitcore-wallet-service:
	cd packages/bitcore-wallet-service && npm test

.PHONY: test-bitcore-wallet-client
test-bitcore-wallet-client:
	cd packages/bitcore-wallet-client && npm test

.PHONY: test-insight-api
test-insight-api:
	cd packages/insight-api && npm test

.PHONY: test-all
test-all: test-bitcoin-rpc \
	test-bitcore-lib \
	test-bitcore-message \
	test-bitcore-mnemonic \
	test-bitcore-node \
	test-bitcore-p2p \
	test-bitcore-payment-protocol \
	test-bitcore-wallet-service \
	test-bitcore-wallet-client \
	test-insight-api

.PHONY: fmt
fmt:
	node_modules/.bin/prettier typescript --write "packages/lw-2/src/**/*.ts"
	node_modules/.bin/prettier es5 --write "packages/{bitcore-*,insight-*,merit-rpc}/**/*.js"
