# Merit URIs

Represents a Merit payment URI. Merit URI strings became the most popular way to share payment request, sometimes as a Merit link and others using a QR code.

URI Examples:

```
merit:M12A1MyfXbW6RhdRAZEqofac5jCQQjwEPB
merit:M12A1MyfXbW6RhdRAZEqofac5jCQQjwEPB?amount=1.2
merit:M12A1MyfXbW6RhdRAZEqofac5jCQQjwEPB?amount=1.2&message=Payment&label=Micro&extra=other-param
```

## URI Validation

The main use that we expect you'll have for the `URI` class in Merit library is validating and parsing Merit URIs. A `URI` instance exposes the address as a Merit library `Address` object and the amount in Micros, if present.

The code for validating URIs looks like this:

```javascript
var uriString = 'merit:12A1MyfXbW6RhdRAZEqofac5jCQQjwEPBu?amount=1.2';
var valid = URI.isValid(uriString);
var uri = new URI(uriString);
console.log(uri.address.network, uri.amount); // 'livenet', 120000000
```

## URI Parameters

All standard parameters can be found as members of the `URI` instance. However a Merit URI may contain other non-standard parameters, all those can be found under the `extra` namespace.

See [the official BIP21 spec](https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki) for more information.

## Create URI

Another important use case for the `URI` class is creating a Merit URI for sharing a payment request. That can be accomplished by using a dictionary to create an instance of URI.

The code for creating an URI from an Object looks like this:

```javascript
var uriString = new URI({
  address: 'M2A1MyfXbW6RhdRAZEqofac5jCQQjwEPB',
  amount: 10000, // in micros
  message: 'My payment request',
});
var uriString = uri.toString();
```
