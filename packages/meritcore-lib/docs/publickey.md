# Public Key

Represents a Merit public key and is needed to be able to receive MRT, as is usually represented as a Merit [Address](address.md).

A PublicKey in Bitcore is an immutable object and can be instantiated from a [Point](crypto.md), string, [PrivateKey](privatekey.md), Buffer or a [BN](crypto.md).

## Instantiate a Public Key
Here is how to instantiate a public key:

```javascript

var privateKey = new PrivateKey();

// from a private key
var publicKey = new PublicKey(privateKey);

// from a der hex encoded string
var publicKey2 = new PublicKey('02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc');
```

## Validating a Public Key

A public key point should be on the [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) curve, instantiating a new PublicKey will validate this and will throw an error if it's invalid. To check that a public key is valid:

```javascript
if (PublicKey.isValid('02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc')){
  // valid public key
}
```

## Compressed vs Uncompressed
It's important to note that there are two possible ways to represent a public key. The standard is _compressed_ and includes the X value and parity (as represented above in the documentation). There is also a longer version that is _uncompressed_ which includes both X and Y values. Using this encoding will generate a different Merit address, so be careful when selecting the encoding.

Example:

```javascript
> var meritcore = require('meritcore-lib');

// compressed public key starting with 0x03 (greater than midpoint of curve)
> var compressedPK = meritcore.PublicKey('030589ee559348bd6a7325994f9c8eff12bd'+
    '5d73cc683142bd0dd1a17abc99b0dc');
> compressedPK.compressed;
true
> compressedPK.toAddress().toString();
'MKbUJ4x8epz6QqxkmZbTc4f79JbWWz6g37'
// compressed public key starting with 0x02 (smaller than midpoint of curve)
> var compressedPK2 = new meritcore.PublicKey('02a1633cafcc01ebfb6d78e39f687a1f'+
    '0995c62fc95f51ead10a02ee0be551b5dc');
> compressedPK2.compressed;
true
> compressedPK.toAddress().toString();
'MKbUJ4x8epz6QqxkmZbTc4f79JbWWz6g37'
// uncompressed public key, starting with 0x04. Contains both X and Y encoded
> var uncompressed = meritcore.PublicKey('0479BE667EF9DCBBAC55A06295CE870B07029'+
    'BFCDB2DCE28D959F2815B16F81798483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68'+
    '554199C47D08FFB10D4B8');
> uncompressed.compressed
false
> uncompressed.toAddress().toString()
'MEHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm'
```
