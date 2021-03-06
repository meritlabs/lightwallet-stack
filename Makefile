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
	cp -f ./packages/lightwallet/mobile/GoogleService-Info.plist ./packages/lightwallet/mobile/platforms/ios/Merit/Resources/Resources/GoogleService-Info.plist

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

.PHONY: build-electron-win
build-electron-win:
  cd ./packages/lightwallet/desktop && npm run electron:build -- --win --x64

.PHONY: build-electron-mac
build-electron-mac:
	cd ./packages/lightwallet/desktop && npm run electron:build -- --mac --x64

.PHONE: build-electron-deb
build-electron-deb:
	cd ./packages/lightwallet/desktop && npm run electron:build -- --linux deb --x64

### lightwallet-stack ###

.PHONY: test-build
test-build: clean-stack \
	prepare-stack \
	build-lw-ww

.PHONY: build-lw-ww
build-lw-ww:
	cd ./packages/lightwallet && npm run build
	cd ./packages/lightwallet/desktop && npm run build

.PHONY: start-mongo
start-mongo:
	mongod --fork --syslog

.PHONY: stop-mongo
stop-mongo:
	kill `pgrep mongo`

# Symlink the Merit meritd
# See https://github.com/meritlabs/lightwallet-stack/blob/master/merit-node/docs/development.md
.PHONY: symlink-merit-node
symlink-merit-node:
	cd ./packages/merit-node/bin && ln -sf ../../../merit/src/meritd

# Within the devnode directory with the configuration file, start the node:
.PHONY: start-merit-node
start-merit-node:
	./packages/merit-node/bin/merit-node start

.PHONY: start-merit-wallet-service
start-merit-wallet-service:
	cd ./packages/merit-wallet-service/ && node locker/locker.js & \
	cd ./packages/merit-wallet-service/ && node messagebroker/messagebroker.js & \
	cd ./packages/merit-wallet-service/ && node bcmonitor/bcmonitor.js & \
	cd ./packages/merit-wallet-service/ && node fiatrateservice/fiatrateservice.js & \
	cd ./packages/merit-wallet-service/ && node mws.js & \
	cd ./packages/merit-wallet-service/ && node pushnotificationsservice/pushnotificationsservice.js & \
	cd ./packages/merit-wallet-service/ && node emailservice/emailservice.js

.PHONY: stop-merit-wallet-service
stop-merit-wallet-service:
	cd ./packages/merit-wallet-service/ && sh stop.sh

.PHONY: clean-npm
clean-npm:
	npm cache clean --force

.PHONY: prepare-stack
prepare-stack: use-lerna

.PHONY: prepare-procuction-stack
prepare-production-stack: use-lerna-production

.PHONY: use-lerna
use-lerna:
	lerna bootstrap

.PHONY: use-lerna-production
use-lerna-production:
	lerna bootstrap -- --production --no-optional

.PHONY: start-stack
start-stack: symlink-merit-node start-merit-node


# Upgrade libs
.PHONY: upgrade-meritcore-lib
upgrade-meritcore-lib:
	cd ./packages/meritcore-lib && ncu -u

.PHONY: upgrade-merit-rpc
upgrade-merit-rpc:
	cd ./packages/merit-rpc && ncu -u

.PHONY: upgrade-insight-api
upgrade-insight-api:
	cd ./packages/insight-api && ncu -u

.PHONY: upgrade-insight-ui
upgrade-insight-ui:
	cd ./packages/insight-ui && ncu -u

.PHONY: upgrade-merit-wallet-service
upgrade-merit-wallet-service:
	cd ./packages/merit-wallet-service && ncu -u

.PHONY: upgrade-merit-p2p
upgrade-merit-p2p:
	cd ./packages/merit-p2p && ncu -u

.PHONY: upgrade-merit-node
upgrade-merit-node:
	cd ./packages/merit-node && ncu -u

.PHONY: upgrade-merit-payment-protocol
upgrade-merit-payment-protocol:
	cd ./packages/merit-payment-protocol && ncu -u

.PHONY: upgrade-lightwallet
upgrade-lightwallet:
	cd ./packages/lightwallet/desktop && ncu -u
	cd ./packages/lightwallet/mobile && ncu -u
	cd ./packages/lightwallet && ncu -u

.PHONY: upgrade-root
upgrade-root:
	ncu -u

.PHONY: upgrade-stack
upgrade-stack: upgrade-meritcore-lib \
	upgrade-merit-rpc \
	upgrade-insight-api \
	upgrade-insight-ui \
	upgrade-merit-wallet-service \
	upgrade-merit-p2p \
	upgrade-merit-node \
	upgrade-merit-payment-protocol \
	upgrade-lightwallet \
	upgrade-root


# Clean
## Preperation Order is based on dependencies ##
.PHONY: clean-meritcore-lib
clean-meritcore-lib:
	rm -rf ./packages/meritcore-lib/node_modules

.PHONY: clean-merit-rpc
clean-merit-rpc:
	rm -rf ./packages/merit-rpc/node_modules

.PHONY: clean-insight-api
clean-insight-api:
	rm -rf ./packages/insight-api/node_modules

.PHONY: clean-insight-ui
clean-insight-ui:
	rm -rf ./packages/insight-ui/node_modules

.PHONY: clean-merit-wallet-service
clean-merit-wallet-service:
	rm -rf ./packages/merit-wallet-service/node_modules

.PHONY: clean-merit-p2p
clean-merit-p2p:
	rm -rf ./packages/merit-p2p/node_modules

.PHONY: clean-merit-node
clean-merit-node:
	rm -rf ./packages/merit-node/node_modules

.PHONY: clean-merit-payment-protocol
clean-merit-payment-protocol:
	rm -rf ./packages/merit-payment-protocol/node_modules

.PHONY: clean-stack
clean-stack: clean-meritcore-lib \
	clean-merit-rpc \
	clean-insight-api \
	clean-insight-ui \
	clean-merit-wallet-service \
	clean-merit-p2p \
	clean-merit-node \
	clean-merit-payment-protocol \
	clean-lightwallet

.PHONY: clean-build
clean-build:
	rm -rf packages/lightwallet/desktop/dist/*
	rm -rf packages/lightwallet/mobile/www/*
	rm -rf ./output.log

.PHONY: test-merit-rpc
test-merit-rpc:
	cd packages/merit-rpc && npm test

.PHONY: test-meritcore-lib
test-meritcore-lib:
	cd packages/meritcore-lib && npm test

.PHONY: test-merit-node
test-merit-node:
	cd packages/merit-node && npm test

.PHONY: test-merit-p2p
test-merit-p2p:
	cd packages/merit-p2p && npm test

.PHONY: test-merit-payment-protocol
test-merit-payment-protocol:
	cd packages/merit-payment-protocol && npm test

.PHONY: test-merit-wallet-service
test-merit-wallet-service:
	cd packages/merit-wallet-service && npm test

.PHONY: test-insight-api
test-insight-api:
	cd packages/insight-api && npm test

.PHONY: test-all
test-all: test-merit-rpc \
	test-meritcore-lib \
	test-merit-node \
	test-merit-p2p \
	test-merit-payment-protocol \
	test-merit-wallet-service \
	test-insight-api

.PHONY: fmt
fmt:
	node_modules/.bin/prettier --parser typescript --write "packages/**/*.{ts,js}" || true
#	node_modules/.bin/prettier --parser scss --write "packages/**/*.{scss,sass}" || true
	node_modules/.bin/prettier --parser markdown --write "**/*.md" || true
