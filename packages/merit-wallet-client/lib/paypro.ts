import { Promise } from 'bluebird';

module PayPro {
  let $ = require('preconditions').singleton();
  
  let Bitcore = require('bitcore-lib');
  let BitcorePayPro = require('bitcore-payment-protocol');

  let _nodeRequest = (opts, cb): Promise<any> => {
    opts.agent = false;
    let http = opts.httpNode || (opts.proto === 'http' ? require("http") : require("https"));

    let fn = opts.method == 'POST' ? 'post' : 'get';

    http[fn](opts, function(res) {
      if (res.statusCode != 200)
        return cb(new Error('HTTP Request Error'));

      let data:any = []; // List of Buffer objects
      res.on("data", function(chunk) {
        data.push(chunk); // Append Buffer object
      });
      res.on("end", function() {
        data = Buffer.concat(data); // Make one large Buffer of it
        return cb(null, data);
      });
    });
  };

  let _browserRequest = (opts, cb) => {
    let method = (opts.method || 'GET').toUpperCase();
    let url = opts.url;
    let req = opts;

    req.headers = req.headers || {};
    req.body = req.body || req.data || '';

    let xhr = opts.xhr || new XMLHttpRequest();
    xhr.open(method, url, true);

    Object.keys(req.headers).forEach(function(key) {
      let val = req.headers[key];
      if (key === 'Content-Length') return;
      if (key === 'Content-Transfer-Encoding') return;
      xhr.setRequestHeader(key, val);
    });
    xhr.responseType = 'arraybuffer';

    xhr.onload = (event) => {
      let response = xhr.response;
      return cb(null, new Uint8Array(response));
    };

    xhr.onerror = (event) => {
      let status;
      if (xhr.status === 0 || !xhr.statusText) {
        status = 'HTTP Request Error';
      } else {
        status = xhr.statusText;
      }
      return cb(new Error(status));
    };

    if (req.body) {
      xhr.send(req.body);
    } else {
      xhr.send(null);
    }
  };

  let _getHttp = (opts) => {
    let match = opts.url.match(/^((http[s]?):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);

    opts.proto = RegExp.$2;
    opts.host = RegExp.$3;
    opts.path = RegExp.$4 + RegExp.$6;
    if (opts.http) return opts.http;

    let env = opts.env;
    if (!env)
      env = (process && !process.browser) ? 'node' : 'browser';

    let http;
    return (env == "node") ? _nodeRequest : http = _browserRequest;;
  };

  export let get = (opts): Promise<any> => {
    $.checkArgument(opts && opts.url);

    let http = _getHttp(opts);
    opts.headers = opts.headers || {
      'Accept': BitcorePayPro.PAYMENT_REQUEST_CONTENT_TYPE,
      'Content-Type': 'application/octet-stream',
    };

    return new Promise((resolve, renew) => {
      http(opts, function(err, dataBuffer) {
        if (err) return cb(err);
        let request, verified, signature, serializedDetails;
        try {
          let body = BitcorePayPro.PaymentRequest.decode(dataBuffer);
          request = (new BitcorePayPro()).makePaymentRequest(body);
          signature = request.get('signature');
          serializedDetails = request.get('serialized_payment_details');
          // Verify the signature
          verified = request.verify(true);
        } catch (e) {
          return cb(new Error('Could not parse payment protocol: ' + e));
        }

        // Get the payment details
        let decodedDetails = BitcorePayPro.PaymentDetails.decode(serializedDetails);
        let pd = new BitcorePayPro();
        pd = pd.makePaymentDetails(decodedDetails);

        let outputs = pd.get('outputs');
        if (outputs.length > 1)
          return cb(new Error('Payment Protocol Error: Requests with more that one output are not supported'))

        let output = outputs[0];

        let amount = output.get('amount').toNumber();
        let network = pd.get('network') == 'test' ? 'testnet' : 'livenet';

        // We love payment protocol
        let offset = output.get('script').offset;
        let limit = output.get('script').limit;

        // NOTE: For some reason output.script.buffer
        // is only an ArrayBuffer
        let buffer = new Buffer(new Uint8Array(output.get('script').buffer));
        let scriptBuf = buffer.slice(offset, limit);
        let addr = new Bitcore.Address.fromScript(new Bitcore.Script(scriptBuf), network);

        let md = pd.get('merchant_data');

        if (md) {
          md = md.toString();
        }

        let ok = verified.verified;
        let caName;

        if (verified.isChain) {
          ok = ok && verified.chainVerified;
        }

        return cb(null, {
          verified: ok,
          caTrusted: verified.caTrusted,
          caName: verified.caName,
          selfSigned: verified.selfSigned,
          expires: pd.get('expires'),
          memo: pd.get('memo'),
          time: pd.get('time'),
          merchant_data: md,
          toAddress: addr.toString(),
          amount: amount,
          network: network,
          domain: opts.host,
          url: opts.url,
        });
      });
    });
  };


  let _getPayProRefundOutputs = (addrStr, amount) => {
    amount = amount.toString(10);

    let output = new BitcorePayPro.Output();
    let addr = new Bitcore.Address(addrStr);

    let s;
    if (addr.isPayToPublicKeyHash()) {
      s = Bitcore.Script.buildPublicKeyHashOut(addr);
    } else if (addr.isPayToScriptHash()) {
      s = Bitcore.Script.buildScriptHashOut(addr);
    } else {
      throw new Error('Unrecognized address type ' + addr.type);
    }

    //  console.log('PayPro refund address set to:', addrStr,s);
    output.set('script', s.toBuffer());
    output.set('amount', amount);
    return [output];
  };


  let _createPayment = (merchant_data, rawTx, refundAddr, amountMicros) => {
    let pay = new BitcorePayPro();
    pay = pay.makePayment();

    if (merchant_data) {
      merchant_data = new Buffer(merchant_data);
      pay.set('merchant_data', merchant_data);
    }

    let txBuf = new Buffer(rawTx, 'hex');
    pay.set('transactions', [txBuf]);

    let refund_outputs = _getPayProRefundOutputs(refundAddr, amountMicros);
    if (refund_outputs)
      pay.set('refund_to', refund_outputs);

    // Unused for now
    // options.memo = '';
    // pay.set('memo', options.memo);

    pay = pay.serialize();
    let buf = new ArrayBuffer(pay.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i < pay.length; i++) {
      view[i] = pay[i];
    }

    return view;
  };

  export let send = (opts, cb) => {
    $.checkArgument(opts.merchant_data)
      .checkArgument(opts.url)
      .checkArgument(opts.rawTx)
      .checkArgument(opts.refundAddr)
      .checkArgument(opts.amountMicros);

    let payment = _createPayment(opts.merchant_data, opts.rawTx, opts.refundAddr, opts.amountMicros);

    let http = _getHttp(opts);
    opts.method = 'POST';
    opts.headers = opts.headers || {
      'Accept': BitcorePayPro.PAYMENT_ACK_CONTENT_TYPE,
      'Content-Type': BitcorePayPro.PAYMENT_CONTENT_TYPE,
      // 'Content-Type': 'application/octet-stream',
    };
    opts.body = payment;

    http(opts, function(err, rawData) {
      if (err) return cb(err);
      let memo;
      if (rawData) {
        try {
          let data = BitcorePayPro.PaymentACK.decode(rawData);
          let pp = new BitcorePayPro();
          let ack = pp.makePaymentACK(data);
          memo = ack.get('memo');
        } catch (e) {};
      }
      return cb(null, rawData, memo);
    });
  };
}