# Merit Payment Protocol

A module for [Merit LWS](https://github.com/meritlabs/lightwallet-stack) that implements [Payment Protocol](https://github.com/bitcoin/bips/blob/master/bip-0070.mediawiki) and other related BIPs.

## Getting Started

The module is distributed as a part of Merit LWS.

For example, the following code would verify a payment request:

```javascript
var PaymentProtocol = require('merit-payment-protocol');

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
Copyright (c) 2017-2020 The Merit Foundation.
