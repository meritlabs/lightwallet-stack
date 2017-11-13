'use strict';

import * as _ from 'lodash';
import * as sjcl from 'sjcl';
import * as Stringify from 'json-stable-stringify';

const $ = require('preconditions').singleton();
let Bitcore = require('bitcore-lib');
let Address = Bitcore.Address;
let PrivateKey = Bitcore.PrivateKey;
let PublicKey = Bitcore.PublicKey;
let crypto = Bitcore.crypto;
let encoding = Bitcore.encoding;

import { Constants } from './constants';
import { Defaults } from './defaults';



export module Utils {

  let SJCL:any  = {};

  export const encryptMessage = function(message, encryptingKey) {
    let key = sjcl.codec.base64.toBits(encryptingKey);
    return sjcl.encrypt(key, message, _.defaults({
      ks: 128,
      iter: 1,
    }, this.SJCL));
  };

  export const  decryptMessage = function(cyphertextJson, encryptingKey) {
    try {
      let key = sjcl.codec.base64.toBits(encryptingKey);
      return sjcl.decrypt(key, cyphertextJson);
    } catch (ex) {
      return cyphertextJson;
    }
  };

  /* TODO: It would be nice to be compatible with meritd signmessage. How
  * the hash is calculated there? */
  export const  hashMessage = function(text) {
    $.checkArgument(text);
    let buf = new Buffer(text);
    let ret = crypto.Hash.sha256sha256(buf);
    ret = new Bitcore.encoding.BufferReader(ret).readReverse();
    return ret;
  };


  export const  signMessage = function(text, privKey) {
    $.checkArgument(text);
    let priv = new PrivateKey(privKey);
    let hash = this.hashMessage(text);
    return crypto.ECDSA.sign(hash, priv, 'little').toString();
  };


  export const  verifyMessage = function(text, signature, pubKey) {
    $.checkArgument(text);
    $.checkArgument(pubKey);

    if (!signature)
      return false;

    let pub = new PublicKey(pubKey);
    let hash = this.hashMessage(text);

    try {
      let sig = new crypto.Signature.fromString(signature);
      return crypto.ECDSA.verify(hash, sig, pub, 'little');
    } catch (e) {
      return false;
    }
  };

  export const  privateKeyToAESKey = function(privKey) {
    $.checkArgument(privKey && _.isString(privKey));
    $.checkArgument(Bitcore.PrivateKey.isValid(privKey), 'The private key received is invalid');
    let pk = Bitcore.PrivateKey.fromString(privKey);
    return Bitcore.crypto.Hash.sha256(pk.toBuffer()).slice(0, 16).toString('base64');
  };

  export const  getCopayerHash = function(name, xPubKey, requestPubKey) {
    return [name, xPubKey, requestPubKey].join('|');
  };

  export const  getProposalHash = function(proposalHeader) {
    function getOldHash(toAddress, amount, message, payProUrl) {
      return [toAddress, amount, (message || ''), (payProUrl || '')].join('|');
    };

    // For backwards compatibility
    if (arguments.length > 1) {
      return getOldHash.apply(this, arguments);
    }

    return Stringify(proposalHeader);
  };

  export const  deriveAddress = function(scriptType, publicKeyRing, path, m, network) {
    $.checkArgument(_.includes(_.values(Constants.SCRIPT_TYPES), scriptType));

    let publicKeys = _.map(publicKeyRing, function(item: any) {
      let xpub = new Bitcore.HDPublicKey(item.xPubKey);
      return xpub.deriveChild(path).publicKey;
    });

    let bitcoreAddress;
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

  export const  xPubToCopayerId = function(xpub) {
    let hash = sjcl.hash.sha256.hash(xpub);
    return sjcl.codec.hex.fromBits(hash);
  };

  export const  signRequestPubKey = function(requestPubKey, xPrivKey) {
    let priv = new Bitcore.HDPrivateKey(xPrivKey).deriveChild(Constants.PATHS.REQUEST_KEY_AUTH).privateKey;
    return this.signMessage(requestPubKey, priv);
  };

  export const  verifyRequestPubKey = function(requestPubKey, signature, xPubKey) {
    let pub = (new Bitcore.HDPublicKey(xPubKey)).deriveChild(Constants.PATHS.REQUEST_KEY_AUTH).publicKey;
    return this.verifyMessage(requestPubKey, signature, pub.toString());
  };

  export const  formatAmount = function(micros, unit, opts) {
    $.shouldBeNumber(micros);
    $.checkArgument(_.includes(_.keys(Constants.UNITS), unit));

    function clipDecimals(number, decimals) {
      let x = number.toString().split('.');
      let d = (x[1] || '0').substring(0, decimals);
      return parseFloat(x[0] + '.' + d);
    };

    function addSeparators(nStr, thousands, decimal, minDecimals) {
      nStr = nStr.replace('.', decimal);
      let x = nStr.split(decimal);
      let x0 = x[0];
      let x1 = x[1];

      x1 = _.dropRightWhile(x1, function(n, i) {
        return n == '0' && i >= minDecimals;
      }).join('');
      let x2 = x.length > 1 ? decimal + x1 : '';

      x0 = x0.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
      return x0 + x2;
    };

    opts = opts || {};

    let u = Constants.UNITS[unit];
    let precision = opts.fullPrecision ? 'full' : 'short';
    let amount = clipDecimals((micros / u.toMicros), u[precision].maxDecimals).toFixed(u[precision].maxDecimals);
    return addSeparators(amount, opts.thousandsSeparator || ',', opts.decimalSeparator || '.', u[precision].minDecimals);
  };

  export const  buildTx = function(txp) {
    let t = new Bitcore.Transaction();

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
      let outputOrder = _.reject(txp.outputOrder, function(order) {
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
    let totalInputs = _.reduce(txp.inputs, function(memo, i) {
      return +i.micros + memo;
    }, 0);
    let totalOutputs = _.reduce(t.outputs, function(memo, o) {
      return +o.micros + memo;
    }, 0);

    $.checkState(totalInputs - totalOutputs >= 0);
    $.checkState(totalInputs - totalOutputs <= Defaults.MAX_TX_FEE);

    return t;
  };
}

