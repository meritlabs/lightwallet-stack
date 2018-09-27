
# merit-wallet-service

A Multisig HD Merit Wallet Service.

# Description

Merit Wallet Service facilitates multisig HD wallets creation and operation through a (hopefully) simple and intuitive REST API.

BWS can usually be installed within minutes and accommodates all the needed infrastructure for peers in a multisig wallet to communicate and operate – with minimum server trust.

# Getting Started
```
 git clone https://github.com/meritlabs/lightwallet-stack.git
 make start-stack
```

This will launch the BWS service (with default settings) at `http://localhost:3232/bws/api`.

BWS needs mongoDB. You can configure the connection at `config.js`

BWS uses by default a Request Rate Limitation to CreateWallet endpoint. If you need to modify it, check defaults.js' `Defaults.RateLimit`

# Security Considerations
 * Private keys are never sent to BWS. Copayers store them locally.
 * Extended public keys are stored on BWS. This allows BWS to easily check wallet balance, send offline notifications to copayers, etc.
 * During wallet creation, the initial copayer creates a wallet secret that contains a private key. All copayers need to prove they have the secret by signing their information with this private key when joining the wallet. The secret should be shared using secured channels.
 * A copayer could join the wallet more than once, and there is no mechanism to prevent this. See [wallet](https://github.com/bitpay/bitcore-wallet)'s confirm command, for a method for confirming copayers.
 * All BWS responses are verified:
  * Addresses and change addresses are derived independently and locally by the copayers from their local data.
  * TX Proposals templates are signed by copayers and verified by others, so the BWS cannot create or tamper with them.

## Contributing

Please, check out our [Contribution guide](https://github.com/meritlabs/lightwallet-stack/blob/master/CONTRIBUTING.md) and [Code of Conduct](https://github.com/meritlabs/lightwallet-stack/blob/master/CODE_OF_CONDUCT.md).

## License

**Code released under [the MIT license](https://github.com/meritlabs/lightwallet-stack/blob/master/LICENSE).**

Copyright (C) 2013 - 2017 BitPay, Inc.
Copyright (C) 2017 - 2018 The Merit Foundation.
