



  


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