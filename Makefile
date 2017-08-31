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