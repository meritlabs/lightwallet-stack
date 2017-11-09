
  /**
   * Get your main addresses
   *
   * @param {Object} opts
   * @param {Boolean} opts.doNotVerify
   * @param {Numeric} opts.limit (optional) - Limit the resultset. Return all addresses by default.
   * @param {Boolean} [opts.reverse=false] (optional) - Reverse the order of returned addresses.
   * @param {Callback} cb
   * @returns {Callback} cb - Return error or the array of addresses
   */
  getMainAddresses(opts:any = {}): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());

    var args = [];
    if (opts.limit) args.push('limit=' + opts.limit);
    if (opts.reverse) args.push('reverse=1');
    var qs = '';
    if (args.length > 0) {
      qs = '?' + args.join('&');
    }
    var url = '/v1/addresses/' + qs;

    return new Promise((resolve, reject) => { 
      this._doGetRequest(url).then((addresses) => {
        if (!opts.doNotVerify) {
          var fake = _.some(addresses, function(address) {
            return !Verifier.checkAddress(this.credentials, address);
          });
          if (fake)
            return reject(new Errors.SERVER_COMPROMISED);
          }
        return resolve(addresses);
      });
    });
  };

  /**
   * Update wallet balance
   *
   * @param {Boolean} opts.twoStep[=false] - Optional: use 2-step balance computation for improved performance
   * @param {Callback} cb
   */
  getBalance(opts:any = {}): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());
    var url = '/v1/balance/';
    if (opts.twoStep) url += '?twoStep=1';
    return this._doGetRequest(url);
  };

  /**
   * Get list of transactions proposals
   *
   * @param {Object} opts
   * @param {Boolean} opts.doNotVerify
   * @param {Boolean} opts.forAirGapped
   * @param {Boolean} opts.doNotEncryptPkr
   * @return {Callback} cb - Return error or array of transactions proposals
   */
  getTxProposals(opts): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());


    return this._doGetRequest('/v1/txproposals/').then((txps) => {
      this._processTxps(txps);

      return Promise.each(txps, (txp) => {
                
      })
      async.every(txps,
        function(txp, acb) {
          if (opts.doNotVerify) return acb(true);
          this.getPayPro(txp, function(err, paypro) {

            var isLegit = Verifier.checkTxProposal(this.credentials, txp, {
              paypro: paypro,
            });

            return acb(isLegit);
          });
        },
        function(isLegit) {
          if (!isLegit)
            return cb(new Errors.SERVER_COMPROMISED);

          var result;
          if (opts.forAirGapped) {
            result = {
              txps: JSON.parse(JSON.stringify(txps)),
              encryptedPkr: opts.doNotEncryptPkr ? null : Utils.encryptMessage(JSON.stringify(this.credentials.publicKeyRing), this.credentials.personalEncryptingKey),
              unencryptedPkr: opts.doNotEncryptPkr ? JSON.stringify(this.credentials.publicKeyRing) : null,
              m: this.credentials.m,
              n: this.credentials.n,
            };
          } else {
            result = txps;
          }
          return cb(null, result);
        }); //end every
    });
  };

  getPayPro(txp): Promise<any> {
    if (!txp.payProUrl || this.doNotVerifyPayPro)
      return cb();

    PayPro.get({
      url: txp.payProUrl,
      http: this.payProHttp,
    }, function(err, paypro) {
      if (err) return cb(new Error('Cannot check transaction now:' + err));
      return cb(null, paypro);
    });
  };


  /**
   * Sign a transaction proposal
   *
   * @param {Object} txp
   * @param {String} password - (optional) A password to decrypt the encrypted private key (if encryption is set).
   * @param {Callback} cb
   * @return {Callback} cb - Return error or object
   */
  signTxProposal(txp, password): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());
    $.checkArgument(txp.creatorId);

    if (_.isFunction(password)) {
      cb = password;
      password = null;
    }


    if (!txp.signatures) {
      if (!this.canSign())
        return cb(new Errors.MISSING_PRIVATE_KEY);

      if (this.isPrivKeyEncrypted() && !password)
        return cb(new Errors.ENCRYPTED_PRIVATE_KEY);
    }

    this.getPayPro(txp, function(err, paypro) {
      if (err) return cb(err);

      var isLegit = Verifier.checkTxProposal(this.credentials, txp, {
        paypro: paypro,
      });

      if (!isLegit)
        return cb(new Errors.SERVER_COMPROMISED);

      var signatures = txp.signatures;

      if (_.isEmpty(signatures)) {
        try {
          signatures = this._signTxp(txp, password);
        } catch (ex) {
          log.error('Error signing tx', ex);
          return cb(ex);
        }
      }

      var url = '/v1/txproposals/' + txp.id + '/signatures/';
      var args = {
        signatures: signatures
      };

      this._doPostRequest(url, args, function(err, txp) {
        if (err) return cb(err);
        this._processTxps(txp);
        return cb(null, txp);
      });
    });
  };


  /**
   * Sign transaction proposal from AirGapped
   *
   * @param {String} key - A mnemonic phrase or an xprv HD private key
   * @param {Object} txp
   * @param {String} unencryptedPkr
   * @param {Number} m
   * @param {Number} n
   * @param {Object} opts
   * @param {String} opts.passphrase
   * @param {Number} opts.account - default 0
   * @param {String} opts.derivationStrategy - default 'BIP44'
   * @return {Object} txp - Return transaction
   */
  signTxProposalFromAirGapped(key, txp, unencryptedPkr, m, n, opts) {
    opts = opts || {}

    var publicKeyRing = JSON.parse(unencryptedPkr);

    if (!_.isArray(publicKeyRing) || publicKeyRing.length != n) {
      throw new Error('Invalid public key ring');
    }

    var newClient = new API({
      baseUrl: 'https://bws.example.com/bws/api' // WHY?!
    });

    if (key.slice(0, 4) === 'xprv' || key.slice(0, 4) === 'tprv') {
      if (key.slice(0, 4) === 'xprv' && txp.network == 'testnet') throw new Error("testnet HD keys must start with tprv");
      if (key.slice(0, 4) === 'tprv' && txp.network == 'livenet') throw new Error("livenet HD keys must start with xprv");
      newClient.seedFromExtendedPrivateKey(key, {
        'account': opts.account,
        'derivationStrategy': opts.derivationStrategy
      });
    } else {
      newClient.seedFromMnemonic(key, {
        'network': txp.network,
        'passphrase': opts.passphrase,
        'account': opts.account,
        'derivationStrategy': opts.derivationStrategy
      })
    }
    newClient.credentials.m = m;
    newClient.credentials.n = n;
    newClient.credentials.addressType = txp.addressType;
    newClient.credentials.addPublicKeyRing(publicKeyRing);

    if (!Verifier.checkTxProposalSignature(newClient.credentials, txp))
      throw new Error('Fake transaction proposal');

    return newClient._signTxp(txp);
  };


  /**
   * Reject a transaction proposal
   *
   * @param {Object} txp
   * @param {String} reason
   * @param {Callback} cb
   * @return {Callback} cb - Return error or object
   */
  rejectTxProposal(txp, reason): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());
    $.checkArgument(cb);


    var url = '/v1/txproposals/' + txp.id + '/rejections/';
    var args = {
      reason: this._encryptMessage(reason, this.credentials.sharedEncryptingKey) || '',
    };
    this._doPostRequest(url, args, function(err, txp) {
      if (err) return cb(err);
      this._processTxps(txp);
      return cb(null, txp);
    });
  };

  /**
   * Broadcast raw transaction
   *
   * @param {Object} opts
   * @param {String} opts.network
   * @param {String} opts.rawTx
   * @param {Callback} cb
   * @return {Callback} cb - Return error or txid
   */
  broadcastRawTx(opts): Promise<any> {
    $.checkState(this.credentials);
    $.checkArgument(cb);


    opts = opts || {};

    var url = '/v1/broadcast_raw/';
    this._doPostRequest(url, opts, function(err, txid) {
      if (err) return cb(err);
      return cb(null, txid);
    });
  };

  _doBroadcast(txp): Promise<any> {
    var url = '/v1/txproposals/' + txp.id + '/broadcast/';
    this._doPostRequest(url, {}, function(err, txp) {
      if (err) return cb(err);
      this._processTxps(txp);
      return cb(null, txp);
    });
  };


  /**
   * Broadcast a transaction proposal
   *
   * @param {Object} txp
   * @param {Callback} cb
   * @return {Callback} cb - Return error or object
   */
  broadcastTxProposal(txp): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());


    this.getPayPro(txp, function(err, paypro) {

      if (paypro) {

        var t = Utils.buildTx(txp);
        this._applyAllSignatures(txp, t);

        PayPro.send({
          http: this.payProHttp,
          url: txp.payProUrl,
          amountMicros: txp.amount,
          refundAddr: txp.changeAddress.address,
          merchant_data: paypro.merchant_data,
          rawTx: t.serialize({
            disableSmallFees: true,
            disableLargeFees: true,
            disableDustOutputs: true
          }),
        }, function(err, ack, memo) {
          if (err) return cb(err);
          this._doBroadcast(txp, function(err, txp) {
            return cb(err, txp, memo);
          });
        });
      } else {
        this._doBroadcast(txp);
      }
    });
  };

  /**
   * Remove a transaction proposal
   *
   * @param {Object} txp
   * @param {Callback} cb
   * @return {Callback} cb - Return error or empty
   */
  removeTxProposal(txp): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());


    var url = '/v1/txproposals/' + txp.id;
    this._doDeleteRequest(url, function(err) {
      return cb(err);
    });
  };

  /**
   * Get transaction history
   *
   * @param {Object} opts
   * @param {Number} opts.skip (defaults to 0)
   * @param {Number} opts.limit
   * @param {Boolean} opts.includeExtendedInfo
   * @param {Callback} cb
   * @return {Callback} cb - Return error or array of transactions
   */
  getTxHistory(opts): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());

    var args = [];
    if (opts) {
      if (opts.skip) args.push('skip=' + opts.skip);
      if (opts.limit) args.push('limit=' + opts.limit);
      if (opts.includeExtendedInfo) args.push('includeExtendedInfo=1');
    }
    var qs = '';
    if (args.length > 0) {
      qs = '?' + args.join('&');
    }

    var url = '/v1/txhistory/' + qs;
    this._doGetRequest(url, function(err, txs) {
      if (err) return cb(err);
      this._processTxps(txs);
      return cb(null, txs);
    });
  };

  /**
   * getTx
   *
   * @param {String} TransactionId
   * @return {Callback} cb - Return error or transaction
   */
  getTx(id): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());

    var url = '/v1/txproposals/' + id;
    this._doGetRequest(url, function(err, txp) {
      if (err) return cb(err);

      this._processTxps(txp);
      return cb(null, txp);
    });
  };


  /**
   * Start an address scanning process.
   * When finished, the scanning process will send a notification 'ScanFinished' to all copayers.
   *
   * @param {Object} opts
   * @param {Boolean} opts.includeCopayerBranches (defaults to false)
   * @param {Callback} cb
   */
  startScan(opts): Promise<any> {
    $.checkState(this.credentials && this.credentials.isComplete());


    var args = {
      includeCopayerBranches: opts.includeCopayerBranches,
    };

    this._doPostRequest('/v1/addresses/scan', args, function(err) {
      return cb(err);
    });
  };

  

  /**
   * Get a note associated with the specified txid
   * @param {Object} opts
   * @param {string} opts.txid - The txid to associate this note with
   */
  getTxNote(opts): Promise<any> {
    $.checkState(this.credentials);


    opts = opts || {};
    this._doGetRequest('/v1/txnotes/' + opts.txid + '/', function(err, note) {
      if (err) return cb(err);
      this._processTxNotes(note);
      return cb(null, note);
    });
  };

  /**
   * Edit a note associated with the specified txid
   * @param {Object} opts
   * @param {string} opts.txid - The txid to associate this note with
   * @param {string} opts.body - The contents of the note
   */
  editTxNote(opts): Promise<any> {
    $.checkState(this.credentials);


    opts = opts || {};
    if (opts.body) {
      opts.body = this._encryptMessage(opts.body, this.credentials.sharedEncryptingKey);
    }
    this._doPutRequest('/v1/txnotes/' + opts.txid + '/', opts, function(err, note) {
      if (err) return cb(err);
      this._processTxNotes(note);
      return cb(null, note);
    });
  };

  /**
   * Get all notes edited after the specified date
   * @param {Object} opts
   * @param {string} opts.minTs - The starting timestamp
   */
  getTxNotes(opts): Promise<any> {
    $.checkState(this.credentials);


    opts = opts || {};
    var args = [];
    if (_.isNumber(opts.minTs)) {
      args.push('minTs=' + opts.minTs);
    }
    var qs = '';
    if (args.length > 0) {
      qs = '?' + args.join('&');
    }

    this._doGetRequest('/v1/txnotes/' + qs, function(err, notes) {
      if (err) return cb(err);
      this._processTxNotes(notes);
      return cb(null, notes);
    });
  };

  /**
   * Returns exchange rate for the specified currency & timestamp.
   * @param {Object} opts
   * @param {string} opts.code - Currency ISO code.
   * @param {Date} [opts.ts] - A timestamp to base the rate on (default Date.now()).
   * @param {String} [opts.provider] - A provider of exchange rates (default 'BitPay').
   * @returns {Object} rates - The exchange rate.
   */
  getFiatRate(opts): Promise<any> {
    $.checkState(this.credentials);
    $.checkArgument(cb);


    var opts = opts || {};

    var args = [];
    if (opts.ts) args.push('ts=' + opts.ts);
    if (opts.provider) args.push('provider=' + opts.provider);
    var qs = '';
    if (args.length > 0) {
      qs = '?' + args.join('&');
    }

    this._doGetRequest('/v1/fiatrates/' + opts.code + '/' + qs, function(err, rates) {
      if (err) return cb(err);
      return cb(null, rates);
    });
  }

  /**
   * Subscribe to push notifications.
   * @param {Object} opts
   * @param {String} opts.type - Device type (ios or android).
   * @param {String} opts.token - Device token.
   * @returns {Object} response - Status of subscription.
   */
  pushNotificationsSubscribe(opts): Promise<any> {
    var url = '/v1/pushnotifications/subscriptions/';
    this._doPostRequest(url, opts, function(err, response) {
      if (err) return cb(err);
      return cb(null, response);
    });
  };

  /**
   * Unsubscribe from push notifications.
   * @param {String} token - Device token
   * @return {Callback} cb - Return error if exists
   */
  pushNotificationsUnsubscribe(token): Promise<any> {
    var url = '/v1/pushnotifications/subscriptions/' + token;
    this._doDeleteRequest(url);
};

  /**
   * Listen to a tx for its first confirmation.
   * @param {Object} opts
   * @param {String} opts.txid - The txid to subscribe to.
   * @returns {Object} response - Status of subscription.
   */
  txConfirmationSubscribe(opts): Promise<any> {
    var url = '/v1/txconfirmations/';
    this._doPostRequest(url, opts, function(err, response) {
      if (err) return cb(err);
      return cb(null, response);
    });
  };

  /**
   * Stop listening for a tx confirmation.
   * @param {String} txid - The txid to unsubscribe from.
   * @return {Callback} cb - Return error if exists
   */
  txConfirmationUnsubscribe(txid): Promise<any> {
    var url = '/v1/txconfirmations/' + txid;
    this._doDeleteRequest(url);
};

  /**
   * Returns send max information.
   * @param {String} opts
   * @param {number} opts.feeLevel[='normal'] - Optional. Specify the fee level ('priority', 'normal', 'economy', 'superEconomy').
   * @param {number} opts.feePerKb - Optional. Specify the fee per KB (in micro).
   * @param {Boolean} opts.excludeUnconfirmedUtxos - Indicates it if should use (or not) the unconfirmed utxos
   * @param {Boolean} opts.returnInputs - Indicates it if should return (or not) the inputs
   * @return {Callback} cb - Return error (if exists) and object result
   */
  getSendMaxInfo(opts): Promise<any> {
    var args = [];
    opts = opts || {};

    if (opts.feeLevel) args.push('feeLevel=' + opts.feeLevel);
    if (opts.feePerKb) args.push('feePerKb=' + opts.feePerKb);
    if (opts.excludeUnconfirmedUtxos) args.push('excludeUnconfirmedUtxos=1');
    if (opts.returnInputs) args.push('returnInputs=1');

    var qs = '';

    if (args.length > 0)
      qs = '?' + args.join('&');

    var url = '/v1/sendmaxinfo/' + qs;

    this._doGetRequest(url, function(err, result) {
      if (err) return cb(err);
      return cb(null, result);
    });
  };

  /**
   * Get wallet status based on a string identifier (one of: walletId, address, txid)
   *
   * @param {string} opts.identifier - The identifier
   * @param {Boolean} opts.twoStep[=false] - Optional: use 2-step balance computation for improved performance
   * @param {Boolean} opts.includeExtendedInfo (optional: query extended status)
   * @returns {Callback} cb - Returns error or an object with status information
   */
  getStatusByIdentifier(opts): Promise<any> {
    $.checkState(this.credentials);

    opts = opts || {};

    var qs = [];
    qs.push('includeExtendedInfo=' + (opts.includeExtendedInfo ? '1' : '0'));
    qs.push('twoStep=' + (opts.twoStep ? '1' : '0'));

    this._doGetRequest('/v1/wallets/' + opts.identifier + '?' + qs.join('&'), function(err, result) {
      if (err || !result || !result.wallet) return cb(err);
      if (result.wallet.status == 'pending') {
        var c = this.credentials;
        result.wallet.secret = this._buildSecret(c.walletId, c.walletPrivKey, c.network);
      }

      this._processStatus(result);

      return cb(err, result);
    });
  };



  referralTxConfirmationSubscribe(opts): Promise<any> {
    const url = '/v1/referraltxconfirmations/';
    this._doPostRequest(url, opts, function(err, response) {
      if (err) return cb(err);
      return cb(null, response);
    });
  };

  referralTxConfirmationUnsubscribe(codeHash): Promise<any> {
    const url = '/v1/referraltxconfirmations/' + codeHash;
    this._doDeleteRequest(url);
  }

  /*
  *
  * Compatibility Functions
  *
  */

  _oldCopayDecrypt(username, password, blob): any {
    var SEP1 = '@#$';
    var SEP2 = '%^#@';

    var decrypted;
    try {
      var passphrase = username + SEP1 + password;
      decrypted = sjcl.decrypt(passphrase, blob);
    } catch (e) {
      passphrase = username + SEP2 + password;
      try {
        decrypted = sjcl.decrypt(passphrase, blob);
      } catch (e) {
        log.debug(e);
      };
    }

    if (!decrypted)
      return null;

    var ret;
    try {
      ret = JSON.parse(decrypted);
    } catch (e) {};
    return ret;
  };


  getWalletIdsFromOldCopay(username, password, blob): any {
    var p = this._oldCopayDecrypt(username, password, blob);
    if (!p) return null;
    var ids = p.walletIds.concat(_.keys(p.focusedTimestamps));
    return _.uniq(ids);
  };


  /**
   * createWalletFromOldCopay
   *
   * @param username
   * @param password
   * @param blob
   * @param cb
   * @return {undefined}
   */
  createWalletFromOldCopay(username, password, blob): Promise<any> {
    var w = this._oldCopayDecrypt(username, password, blob);
    if (!w) return cb(new Error('Could not decrypt'));

    if (w.publicKeyRing.copayersExtPubKeys.length != w.opts.totalCopayers)
      return cb(new Error('Wallet is incomplete, cannot be imported'));

    this.credentials = Credentials.fromOldCopayWallet(w);
    this.recreateWallet(cb);
  };

  /**
   *
   * Checks the blockChain for a valid EasySend transaction that can be unlocked.
   * @param {String} EasyReceiptScript The script of the easySend, generated client side
   * @param cb Callback or handler to manage response from BWS
   * @return {undefined}
   */
  validateEasyScript(scriptId): Promise<any> {

    console.log("Validating: " + scriptId);

    var url = '/v1/easyreceive/validate/' + scriptId;
    this._doGetRequest(url, function(err, body) {
      if (err) return cb(err);
      return cb(null, body);
    });

  };