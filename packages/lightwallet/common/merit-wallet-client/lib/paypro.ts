import * as request from 'superagent';
import * as _ from 'lodash';
import { Logger } from './log';
import * as preconditions from 'preconditions';
import * as Meritcore from 'meritcore-lib';
import * as MeritcorePayPro from 'merit-payment-protocol';
const $ = preconditions.singleton();

export namespace PayPro {
  const logger = Logger.getInstance();
  logger.setLevel('debug');
  const TIMEOUT = 5000;

  let _request = (opts: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      let fn = opts.method == 'POST' ? 'post' : 'get';
      if (!opts.url) {
        return reject(new Error('No URL for PayPro request.'));
      }
      let reqUrl = opts.url;

      let r = request[fn](reqUrl);
      r.accept('json');

      let headers = opts.headers || {};
      //req.body = req.body || req.data || '';
      _.each(headers, (v, k) => {
        if (v) r.set(k, v);
      });

      r.timeout(TIMEOUT);

      return r.then(res => {
        if (!res) {
          return reject(new Error('No reply from PayPro'));
        }

        return resolve(res);
      });
    });
  };

  export let get = (opts): Promise<any> => {
    $.checkArgument(opts && opts.url);

    opts.headers = opts.headers || {
      Accept: MeritcorePayPro.PAYMENT_REQUEST_CONTENT_TYPE,
      'Content-Type': 'application/octet-stream',
    };

    return _request(opts).then(res => {
      let request, verified, signature, serializedDetails;
      try {
        let body = MeritcorePayPro.PaymentRequest.decode(res.body);
        request = new MeritcorePayPro().makePaymentRequest(body);
        signature = request.get('signature');
        serializedDetails = request.get('serialized_payment_details');
        // Verify the signature
        verified = request.verify(true);
      } catch (e) {
        return Promise.reject(new Error('Could not parse payment protocol: ' + e));
      }

      // Get the payment details
      let decodedDetails = MeritcorePayPro.PaymentDetails.decode(serializedDetails);
      let pd = new MeritcorePayPro();
      pd = pd.makePaymentDetails(decodedDetails);

      let outputs = pd.get('outputs');
      if (outputs.length > 1)
        return Promise.reject(
          new Error('Payment Protocol Error: Requests with more that one output are not supported'),
        );

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
      let addr = new Meritcore.Address.fromScript(new Meritcore.Script(scriptBuf), network);

      let md = pd.get('merchant_data');

      if (md) {
        md = md.toString();
      }

      let ok = verified.verified;
      let caName;

      if (verified.isChain) {
        ok = ok && verified.chainVerified;
      }

      return Promise.resolve({
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
  };

  let _getPayProRefundOutputs = (addrStr, amount) => {
    amount = amount.toString(10);

    let output = new MeritcorePayPro.Output();
    let addr = new Meritcore.Address(addrStr);

    let s;
    if (addr.isPayToPublicKeyHash()) {
      s = Meritcore.Script.buildPublicKeyHashOut(addr);
    } else if (addr.isPayToScriptHash()) {
      s = Meritcore.Script.buildScriptHashOut(addr);
    } else {
      throw new Error('Unrecognized address type ' + addr.type);
    }

    //  this.logger.info('PayPro refund address set to:', addrStr,s);
    output.set('script', s.toBuffer());
    output.set('amount', amount);
    return [output];
  };

  let _createPayment = (merchant_data, rawTx, refundAddr, amountMicros) => {
    let pay = new MeritcorePayPro();
    pay = pay.makePayment();

    if (merchant_data) {
      merchant_data = new Buffer(merchant_data);
      pay.set('merchant_data', merchant_data);
    }

    let txBuf = new Buffer(rawTx, 'hex');
    pay.set('transactions', [txBuf]);

    let refund_outputs = _getPayProRefundOutputs(refundAddr, amountMicros);
    if (refund_outputs) pay.set('refund_to', refund_outputs);

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

  export let send = (opts: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      $.checkArgument(opts.merchant_data)
        .checkArgument(opts.url)
        .checkArgument(opts.rawTx)
        .checkArgument(opts.refundAddr)
        .checkArgument(opts.amountMicros);

      let payment = _createPayment(opts.merchant_data, opts.rawTx, opts.refundAddr, opts.amountMicros);

      opts.method = 'POST';
      opts.headers = opts.headers || {
        Accept: MeritcorePayPro.PAYMENT_ACK_CONTENT_TYPE,
        'Content-Type': MeritcorePayPro.PAYMENT_CONTENT_TYPE,
        // 'Content-Type': 'application/octet-stream',
      };
      opts.body = payment;

      return _request(opts).then(rawData => {
        if (!rawData) return reject(new Error('No RawData from PayPro sending event.'));
        let memo;
        try {
          let data = MeritcorePayPro.PaymentACK.decode(rawData);
          let pp = new MeritcorePayPro();
          let ack = pp.makePaymentACK(data);
          memo = ack.get('memo');
        } catch (e) {
          logger.info('Error in PayPro Payment Ack: ' + e);
        }
        return resolve({ rawData, memo });
      });
    });
  };
}
