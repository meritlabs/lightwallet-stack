'use strict';

import * as _ from 'lodash';
import { preconditions as _$ } from 'preconditions';
const $ = _$.singleton();
import * as sjcl from 'sjcl';
import * as Stringify from 'json-stable-stringify';

let Bitcore = require('bitcore-lib');
let Address = Bitcore.Address;
let PrivateKey = Bitcore.PrivateKey;
let PublicKey = Bitcore.PublicKey;
let crypto = Bitcore.crypto;
let encoding = Bitcore.encoding;

import { Constants } from './constants';
import { Defaults } from './defaults';

export class Utils {


  public SJCL:any  = {};

  public encryptMessage = function(message, encryptingKey) {
    var key = sjcl.codec.base64.toBits(encryptingKey);
    return sjcl.encrypt(key, message, _.defaults({
      ks: 128,
      iter: 1,
    }, this.SJCL));
  };

  public decryptMessage = function(cyphertextJson, encryptingKey) {
    try {
      var key = sjcl.codec.base64.toBits(encryptingKey);
      return sjcl.decrypt(key, cyphertextJson);
    } catch (ex) {
      return cyphertextJson;
    }
  };

  /* TODO: It would be nice to be compatible with meritd signmessage. How
  * the hash is calculated there? */
  public hashMessage = function(text) {
    $.checkArgument(text);
    var buf = new Buffer(text);
    var ret = crypto.Hash.sha256sha256(buf);
    ret = new Bitcore.encoding.BufferReader(ret).readReverse();
    return ret;
  };


  public signMessage = function(text, privKey) {
    $.checkArgument(text);
    var priv = new PrivateKey(privKey);
    var hash = this.hashMessage(text);
    return crypto.ECDSA.sign(hash, priv, 'little').toString();
  };


  public verifyMessage = function(text, signature, pubKey) {
    $.checkArgument(text);
    $.checkArgument(pubKey);

    if (!signature)
      return false;

    var pub = new PublicKey(pubKey);
    var hash = this.hashMessage(text);

    try {
      var sig = new crypto.Signature.fromString(signature);
      return crypto.ECDSA.verify(hash, sig, pub, 'little');
    } catch (e) {
      return false;
    }
  };

  public privateKeyToAESKey = function(privKey) {
    $.checkArgument(privKey && _.isString(privKey));
    $.checkArgument(Bitcore.PrivateKey.isValid(privKey), 'The private key received is invalid');
    var pk = Bitcore.PrivateKey.fromString(privKey);
    return Bitcore.crypto.Hash.sha256(pk.toBuffer()).slice(0, 16).toString('base64');
  };

  public getCopayerHash = function(name, xPubKey, requestPubKey) {
    return [name, xPubKey, requestPubKey].join('|');
  };

  public getProposalHash = function(proposalHeader) {
    function getOldHash(toAddress, amount, message, payProUrl) {
      return [toAddress, amount, (message || ''), (payProUrl || '')].join('|');
    };

    // For backwards compatibility
    if (arguments.length > 1) {
      return getOldHash.apply(this, arguments);
    }

    return Stringify(proposalHeader);
  };

  public deriveAddress = function(scriptType, publicKeyRing, path, m, network) {
    $.checkArgument(_.includes(_.values(Constants.SCRIPT_TYPES), scriptType));

    var publicKeys = _.map(publicKeyRing, function(item: any) {
      var xpub = new Bitcore.HDPublicKey(item.xPubKey);
      return xpub.deriveChild(path).publicKey;
    });

    var bitcoreAddress;
    switch (scriptType) {
      case Constants.SCRIPT_TYPES.P2SH:
        bitcoreAddress = Address.createMultisig(publicKeys, m, network);
        break;
      case Constants.SCRIPT_TYPES.P2PKH:
        $.checkState(_.isArray(publicKeys) && publicKeys.length == 1);
        bitcoreAddress = Address.fromPublicKey(publicKeys[0], network);
        break;
    }

    return {
      address: bitcoreAddress.toString(),
      path: path,
      publicKeys: _.invoke(publicKeys, 'toString'),
    };
  };

  public xPubToCopayerId = function(xpub) {
    var hash = sjcl.hash.sha256.hash(xpub);
    return sjcl.codec.hex.fromBits(hash);
  };

  public signRequestPubKey = function(requestPubKey, xPrivKey) {
    var priv = new Bitcore.HDPrivateKey(xPrivKey).deriveChild(Constants.PATHS.REQUEST_KEY_AUTH).privateKey;
    return this.signMessage(requestPubKey, priv);
  };

  public verifyRequestPubKey = function(requestPubKey, signature, xPubKey) {
    var pub = (new Bitcore.HDPublicKey(xPubKey)).deriveChild(Constants.PATHS.REQUEST_KEY_AUTH).publicKey;
    return this.verifyMessage(requestPubKey, signature, pub.toString());
  };

  public formatAmount = function(micros, unit, opts) {
    $.shouldBeNumber(micros);
    $.checkArgument(_.includes(_.keys(Constants.UNITS), unit));

    function clipDecimals(number, decimals) {
      var x = number.toString().split('.');
      var d = (x[1] || '0').substring(0, decimals);
      return parseFloat(x[0] + '.' + d);
    };

    function addSeparators(nStr, thousands, decimal, minDecimals) {
      nStr = nStr.replace('.', decimal);
      var x = nStr.split(decimal);
      var x0 = x[0];
      var x1 = x[1];

      x1 = _.dropRightWhile(x1, function(n, i) {
        return n == '0' && i >= minDecimals;
      }).join('');
      var x2 = x.length > 1 ? decimal + x1 : '';

      x0 = x0.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
      return x0 + x2;
    };

    opts = opts || {};

    var u = Constants.UNITS[unit];
    var precision = opts.fullPrecision ? 'full' : 'short';
    var amount = clipDecimals((micros / u.toMicros), u[precision].maxDecimals).toFixed(u[precision].maxDecimals);
    return addSeparators(amount, opts.thousandsSeparator || ',', opts.decimalSeparator || '.', u[precision].minDecimals);
  };

  public buildTx = function(txp) {
    var t = new Bitcore.Transaction();

    $.checkState(_.includes(_.values(Constants.SCRIPT_TYPES), txp.addressType));

    switch (txp.addressType) {
      case Constants.SCRIPT_TYPES.P2SH:
        _.each(txp.inputs, function(i) {
          t.from(i, i.publicKeys, txp.requiredSignatures);
        });
        break;
      case Constants.SCRIPT_TYPES.P2PKH:
        t.from(txp.inputs);
        break;
    }

    if (txp.toAddress && txp.amount && !txp.outputs) {
      t.to(txp.toAddress, txp.amount);
    } else if (txp.outputs) {
      _.each(txp.outputs, function(o) {
        $.checkState(o.script || o.toAddress, 'Output should have either toAddress or script specified');
        if (o.script) {
          t.addOutput(new Bitcore.Transaction.Output({
            script: o.script,
            micros: o.amount
          }));
        } else {
          t.to(o.toAddress, o.amount);
        }
      });
    }

    t.fee(txp.fee);
    t.change(txp.changeAddress.address);

    // Shuffle outputs for improved privacy
    if (t.outputs.length > 1) {
      var outputOrder = _.reject(txp.outputOrder, function(order) {
        return order >= t.outputs.length;
      });
      $.checkState(t.outputs.length == outputOrder.length);
      t.sortOutputs(function(outputs) {
        return _.map(outputOrder, function(i) {
          return outputs[i];
        });
      });
    }

    // Validate inputs vs outputs independently of Bitcore
    var totalInputs = _.reduce(txp.inputs, function(memo, i) {
      return +i.micros + memo;
    }, 0);
    var totalOutputs = _.reduce(t.outputs, function(memo, o) {
      return +o.micros + memo;
    }, 0);

    $.checkState(totalInputs - totalOutputs >= 0);
    $.checkState(totalInputs - totalOutputs <= Defaults.MAX_TX_FEE);

    return t;
  };
}

