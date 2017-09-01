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
	#todo

.PHONY: stop-bitcore-wallet-service
stop-bitcore-wallet-service:
	#todo

.PHONY: bootstrap-lightwallet-stack
bootstrap-lightwallet-stack:
	#todo
