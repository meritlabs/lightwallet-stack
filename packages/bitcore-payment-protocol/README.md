Bitcore Payment Protocol
=======

[![NPM Package](https://img.shields.io/npm/v/bitcore-payment-protocol.svg?style=flat-square)](https://www.npmjs.org/package/bitcore-payment-protocol)
[![Build Status](https://img.shields.io/travis/bitpay/bitcore-payment-protocol.svg?branch=master&style=flat-square)](https://travis-ci.org/bitpay/bitcore-payment-protocol)
[![Coverage Status](https://img.shields.io/coveralls/bitpay/bitcore-payment-protocol.svg?style=flat-square)](https://coveralls.io/r/bitpay/bitcore-payment-protocol)

A module for [bitcore](https://github.com/bitpay/bitcore) that implements [Payment Protocol](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki) and other related BIPs.

## Getting Started

This library is distributed in both the npm and bower packaging systems.

```sh
npm install bitcore-lib
npm install bitcore-payment-protocol
```

```sh
bower install bitcore-lib
bower install bitcore-payment-protocol
```

There are many examples of how to use it on the developer guide [section for payment protocol](https://bitcore.io/api/paypro). For example, the following code would verify a payment request:

```javascript
var PaymentProtocol = require('bitcore-payment-protocol');

var body = PaymentProtocol.PaymentRequest.decode(rawbody);
var request = new PaymentProtocol().makePaymentRequest(body);

var version = pr.get('payment_details_version');
var pki_type = pr.get('pki_type');
var pki_data = pr.get('pki_data');
var serializedDetails = pr.get('serialized_payment_details');
var signature = pr.get('signature');

// Verify the signature
var verified = request.verify();
```

## Contributing

Please, check out our [Contribution guide](https://github.com/meritlabs/lightwallet-stack/blob/master/CONTRIBUTING.md) and [Code of Conduct](https://github.com/meritlabs/lightwallet-stack/blob/master/CODE_OF_CONDUCT.md).

## License

**Code released under [the MIT license](https://github.com/meritlabs/lightwallet-stack/blob/master/LICENSE).**

Copyright (C) 2013 - 2017 BitPay, Inc.
Copyright (C) 2017 - 2018 The Merit Foundation.
