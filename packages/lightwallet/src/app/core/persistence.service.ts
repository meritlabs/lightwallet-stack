import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import { Logger } from 'merit/core/logger';
import { EasyReceipt } from 'merit/easy-receive/easy-receipt.model';
import { ISendMethod } from 'merit/transact/send/send-method.model';

const Keys = {
  ADDRESS_BOOK: network => 'addressbook-' + network,
  AGREE_DISCLAIMER: 'agreeDisclaimer',
  AMAZON_GIFT_CARDS: network => 'amazonGiftCards-' + network,
  APP_IDENTITY: network => 'appIdentity-' + network,
  BACKUP: walletId => 'backup-' + walletId,
  BALANCE_CACHE: cardId => 'balanceCache-' + cardId,
  BITPAY_ACCOUNTS_V2: network => 'bitpayAccounts-v2-' + network,
  CLEAN_AND_SCAN_ADDRESSES: 'CleanAndScanAddresses',
  COINBASE_REFRESH_TOKEN: network => 'coinbaseRefreshToken-' + network,
  COINBASE_TOKEN: network => 'coinbaseToken-' + network,
  COINBASE_TXS: network => 'coinbaseTxs-' + network,
  CONFIG: 'config',
  PENDING_EASY_SENDS: walletId => 'pendingEasySends-' + walletId,
  EASY_RECEIPTS: 'easyReceipts',
  FEEDBACK: 'feedback',
  FOCUSED_WALLET_ID: 'focusedWalletId',
  GLIDERA_PERMISSIONS: network => 'glideraPermissions-' + network,
  GLIDERA_STATUS: network => 'glideraStatus-' + network,
  GLIDERA_TOKEN: network => 'glideraToken-' + network,
  GLIDERA_TXS: network => 'glideraTxs-' + network,
  HIDE_BALANCE: walletId => 'hideBalance-' + walletId,
  HOME_TIP: 'homeTip',
  LAST_ADDRESS: walletId => 'lastAddress-' + walletId,
  LAST_CURRENCY_USED: 'lastCurrencyUsed',
  PROFILE: 'profile',
  REMOTE_PREF_STORED: 'remotePrefStored',
  TX_CONFIRM_NOTIF: txid => 'txConfirmNotif-' + txid,
  TX_HISTORY: walletId => 'txsHistory-' + walletId,
  SEND_HISTORY: 'sendHistory',
  HIDDEN_REQUESTS_ADDRESSES: 'hiddenRequestsAddresses',
  ACTIVE_UNLOCK_REQUESTS_NUMBER: 'activeUnlockRequests',
};

@Injectable()
export class PersistenceService {

  constructor(private storage: Storage,
              private log: Logger) {
  }

  storeNewProfile(profile): Promise<void> {
    return this.set(Keys.PROFILE, profile);
  }

  storeProfile(profile): Promise<void> {
    return this.set(Keys.PROFILE, profile);
  }

  getProfile() {
    return this.get(Keys.PROFILE);
  }

  deleteProfile(): Promise<void> {
    return this.remove(Keys.PROFILE);
  }

  async addPendingEasyReceipt(receipt: EasyReceipt) {
    let receipts = await this.get(Keys.EASY_RECEIPTS);
    receipts = receipts || [];
    // prevent storing of the same receipt twice
    receipts = receipts.filter((r) =>
      !(r.secret == receipt.secret && r.senderPublicKey == receipt.senderPublicKey)
    );
    receipts.push(receipt);
    await this.set(Keys.EASY_RECEIPTS, receipts);
  }

  getPendingsEasyReceipts(): Promise<any> {
    return this.get(Keys.EASY_RECEIPTS);
  }

  async deletePendingEasyReceipt(receipt: EasyReceipt) {
    let receipts = await this.get(Keys.EASY_RECEIPTS);
    receipts = receipts || [];
    receipts = receipts.filter((r) =>
      !(r.secret == receipt.secret && r.senderPublicKey == receipt.senderPublicKey)
    );
    await this.set(Keys.EASY_RECEIPTS, receipts);
  }

  setFeedbackInfo(feedbackValues: any): Promise<void> {
    return this.set(Keys.FEEDBACK, feedbackValues);
  }

  getFeedbackInfo(): Promise<void> {
    return this.get(Keys.FEEDBACK);
  }

  storeFocusedWalletId(walletId: string): Promise<void> {
    return this.set(Keys.FOCUSED_WALLET_ID, walletId || '');
  }

  getFocusedWalletId(): Promise<string> {
    return this.get(Keys.FOCUSED_WALLET_ID);
  }

  getLastAddress(walletId: string): Promise<any> {
    return this.get(Keys.LAST_ADDRESS(walletId));
  }

  storeLastAddress(walletId: string, address: any): Promise<void> {
    return this.set(Keys.LAST_ADDRESS(walletId), address);
  }

  clearLastAddress(walletId: string): Promise<void> {
    return this.remove(Keys.LAST_ADDRESS(walletId));
  }

  setBackupFlag(walletId: string): Promise<void> {
    return this.set(Keys.BACKUP(walletId), Date.now());
  }

  getBackupFlag(walletId: string): Promise<any> {
    return this.get(Keys.BACKUP(walletId));
  }

  clearBackupFlag(walletId: string): Promise<void> {
    return this.remove(Keys.BACKUP(walletId));
  }

  setCleanAndScanAddresses(walletId: string): Promise<void> {
    return this.set(Keys.CLEAN_AND_SCAN_ADDRESSES, walletId);
  }

  getCleanAndScanAddresses(): Promise<any> {
    return this.get(Keys.CLEAN_AND_SCAN_ADDRESSES);
  }

  removeCleanAndScanAddresses(): Promise<void> {
    return this.remove(Keys.CLEAN_AND_SCAN_ADDRESSES);
  };

  getConfig(): Promise<object> {
    return this.get(Keys.CONFIG);
  };

  storeConfig(config: object): Promise<void> {
    return this.set(Keys.CONFIG, config);
  };

  clearConfig(): Promise<void> {
    return this.remove(Keys.CONFIG);
  };

  getHomeTipAccepted(): Promise<any> {
    return this.get(Keys.HOME_TIP);
  };

  setHomeTipAccepted(homeTip: any): Promise<void> {
    return this.set(Keys.HOME_TIP, homeTip);
  };

  setHideBalanceFlag(walletId: string, val: any): Promise<void> {
    return this.set(Keys.HIDE_BALANCE(walletId), val);
  };

  getHideBalanceFlag(walletId: string): Promise<any> {
    return this.get(Keys.HIDE_BALANCE(walletId));
  };

  //for compatibility
  getCopayDisclaimerFlag(): Promise<any> {
    return this.get(Keys.AGREE_DISCLAIMER);
  };

  setRemotePrefsStoredFlag(): Promise<void> {
    return this.set(Keys.REMOTE_PREF_STORED, true);
  };

  getRemotePrefsStoredFlag(): Promise<any> {
    return this.get(Keys.REMOTE_PREF_STORED);
  };

  setGlideraToken(network: string, token: string): Promise<void> {
    return this.set(Keys.GLIDERA_TOKEN(network), token);
  };

  getGlideraToken(network: string): Promise<string> {
    return this.get(Keys.GLIDERA_TOKEN(network));
  };

  removeGlideraToken(network: string): Promise<void> {
    return this.remove(Keys.GLIDERA_TOKEN(network));
  };

  setGlideraPermissions(network: string, permissions: any): Promise<void> {
    return this.set(Keys.GLIDERA_PERMISSIONS(network), permissions);
  };

  getGlideraPermissions(network: string): Promise<any> {
    return this.get(Keys.GLIDERA_PERMISSIONS(network));
  };

  removeGlideraPermissions(network: string): Promise<void> {
    return this.remove(Keys.GLIDERA_PERMISSIONS(network));
  };

  setGlideraStatus(network: string, status: any): Promise<void> {
    return this.set(Keys.GLIDERA_STATUS(network), status);
  };

  getGlideraStatus(network: string): Promise<any> {
    return this.get(Keys.GLIDERA_STATUS(network));
  };

  removeGlideraStatus(network: string): Promise<void> {
    return this.remove(Keys.GLIDERA_STATUS(network));
  };

  setGlideraTxs(network: string, txs: any): Promise<void> {
    return this.set(Keys.GLIDERA_TXS(network), txs);
  };

  getGlideraTxs(network: string): Promise<any> {
    return this.get(Keys.GLIDERA_TXS(network));
  };

  removeGlideraTxs(network: string): Promise<void> {
    return this.remove(Keys.GLIDERA_TXS(network));
  };

  setCoinbaseToken(network: string, token: string): Promise<void> {
    return this.set(Keys.COINBASE_TOKEN(network), token);
  };

  getCoinbaseToken(network: string): Promise<string> {
    return this.get(Keys.COINBASE_TOKEN(network));
  };

  removeCoinbaseToken(network: string): Promise<void> {
    return this.remove(Keys.COINBASE_TOKEN(network));
  };

  setCoinbaseRefreshToken(network: string, token: string): Promise<void> {
    return this.set(Keys.COINBASE_REFRESH_TOKEN(network), token);
  };

  getCoinbaseRefreshToken(network: string): Promise<string> {
    return this.get(Keys.COINBASE_REFRESH_TOKEN(network));
  };

  removeCoinbaseRefreshToken(network: string): Promise<void> {
    return this.remove(Keys.COINBASE_REFRESH_TOKEN(network));
  };

  setCoinbaseTxs(network: string, ctx: any): Promise<void> {
    return this.set(Keys.COINBASE_TXS(network), ctx);
  };

  getCoinbaseTxs(network: string): Promise<any> {
    return this.get(Keys.COINBASE_TXS(network));
  };

  removeCoinbaseTxs(network: string): Promise<void> {
    return this.remove(Keys.COINBASE_TXS(network));
  };

  setAddressbook(network: string, addressbook: any): Promise<void> {
    return this.set(Keys.ADDRESS_BOOK(network), addressbook);
  };

  getAddressbook(network: string): Promise<any> {
    return this.get(Keys.ADDRESS_BOOK(network));
  };

  removeAddressbook(network: string): Promise<void> {
    return this.remove(Keys.ADDRESS_BOOK(network));
  };

  setLastCurrencyUsed(lastCurrencyUsed: any): Promise<void> {
    return this.set(Keys.LAST_CURRENCY_USED, lastCurrencyUsed);
  };

  getLastCurrencyUsed(): Promise<any> {
    return this.get(Keys.LAST_CURRENCY_USED);
  };

  checkQuota(): void {
    let block = '';
    // 50MB
    for (let i = 0; i < 1024 * 1024; ++i) {
      block += '12345678901234567890123456789012345678901234567890';
    }
    this.set('test', block).catch(err => {
      this.log.error('CheckQuota Return:' + err);
    });
  };

  setTxHistory(walletId: string, txs: any): Promise<void> {
    return this.set(Keys.TX_HISTORY(walletId), txs).catch(err => {
      this.log.error('Error saving tx History. Size:' + txs.length);
      this.log.error(err);
    });
  }

  getTxHistory(walletId: string): Promise<any> {
    return this.get(Keys.TX_HISTORY(walletId));
  }

  removeTxHistory(walletId: string): Promise<void> {
    return this.remove(Keys.TX_HISTORY(walletId));
  }

  getSendHistory() {
    return this.storage.get(Keys.SEND_HISTORY);
  }

  registerSend(method: ISendMethod) {
    return this.storage.get(Keys.SEND_HISTORY).then((history) => {
      if (!history) history = [];
      history.push({
        method,
        timestamp: Date.now()
      });
      return this.storage.set(Keys.SEND_HISTORY, history);
    });
  }

  setPendingEasySends(walletId: string, easysends: any): Promise<void> {
    return this.set(Keys.PENDING_EASY_SENDS(walletId), easysends).catch(err => {
      this.log.error('Error saving pending EasySends. Size:' + easysends.length);
      this.log.error(err);
    });
  }

  getPendingEasySends(walletId: string): Promise<any> {
    return this.get(Keys.PENDING_EASY_SENDS(walletId));
  }

  removePendingEasySends(walletId: string): Promise<void> {
    return this.remove(Keys.PENDING_EASY_SENDS(walletId));
  }

  setBalanceCache(cardId: string, data: any): Promise<void> {
    return this.set(Keys.BALANCE_CACHE(cardId), data);
  };

  getBalanceCache(cardId: string): Promise<any> {
    return this.get(Keys.BALANCE_CACHE(cardId));
  };

  removeBalanceCache(cardId: string): Promise<void> {
    return this.remove(Keys.BALANCE_CACHE(cardId));
  };

  setAppIdentity(network: string, data: any): Promise<void> {
    return this.set(Keys.APP_IDENTITY(network), data);
  };

  getAppIdentity(network: string): Promise<any> {
    return this.get(Keys.APP_IDENTITY(network)).then(data => {
      return JSON.parse(data || '{}');
    });
  };

  removeAppIdentity(network: string): Promise<void> {
    return this.remove(Keys.APP_IDENTITY(network));
  };

  removeAllWalletData(walletId: string): Promise<void> {
    return this.clearLastAddress(walletId)
      .then(() => {
        return this.removeTxHistory(walletId);
      })
      .then(() => {
        return this.clearBackupFlag(walletId);
      });
  };

  setAmazonGiftCards(network: string, gcs: any): Promise<void> {
    return this.set(Keys.AMAZON_GIFT_CARDS(network), gcs);
  };

  getAmazonGiftCards(network: string): Promise<any> {
    return this.get(Keys.AMAZON_GIFT_CARDS(network));
  };

  removeAmazonGiftCards(network: string): Promise<void> {
    return this.remove(Keys.AMAZON_GIFT_CARDS(network));
  };

  setTxConfirmNotification(txid: string, val: any): Promise<void> {
    return this.set(Keys.TX_CONFIRM_NOTIF(txid), val);
  };

  getTxConfirmNotification(txid: string): Promise<any> {
    return this.get(Keys.TX_CONFIRM_NOTIF(txid));
  };

  removeTxConfirmNotification(txid: string): Promise<void> {
    return this.remove(Keys.TX_CONFIRM_NOTIF(txid));
  };

  //
  getBitpayAccounts(network: string): Promise<any> {
    return this.get(Keys.BITPAY_ACCOUNTS_V2(network));
  };

  setBitpayAccount(network: string, data: {
    email: string,
    token: string,
    familyName?: string, // last name
    givenName?: string, // firstName
  }): Promise<any> {
    return this.getBitpayAccounts(network)
      .then(allAccounts => {
        allAccounts = allAccounts || {};
        let account = allAccounts[data.email] || {};
        account.token = data.token;
        account.familyName = data.familyName;
        account.givenName = data.givenName;
        allAccounts[data.email] = account;

        this.log.info('Storing BitPay accounts with new account:' + data.email);
        return this.set(Keys.BITPAY_ACCOUNTS_V2(network), allAccounts);
      });
  };

  removeBitpayAccount(network: string, email: string): Promise<void> {
    return this.getBitpayAccounts(network)
      .then(allAccounts => {
        allAccounts = allAccounts || {};
        delete allAccounts[email];
        return this.set(Keys.BITPAY_ACCOUNTS_V2(network), allAccounts);
      });
  };


  setBitpayDebitCards(network: string, email: string, cards: any): Promise<void> {
    return this.getBitpayAccounts(network)
      .then(allAccounts => {
        allAccounts = allAccounts || {};
        if (!allAccounts[email]) throw new Error('Cannot set cards for unknown account ' + email);
        allAccounts[email].cards = cards;
        return this.set(Keys.BITPAY_ACCOUNTS_V2(network), allAccounts);
      });
  };

  getBitpayDebitCards(network: string): Promise<any[]> {
    return this.getBitpayAccounts(network)
      .then(allAccounts => {
        let allCards = [];
        _.each(allAccounts, (account, email) => {
          if (account.cards) {
            // Add account's email to each card
            let cards = _.clone(account.cards);
            _.each(cards, function (x) {
              x.email = email;
            });

            allCards = allCards.concat(cards);
          }
        });
        return allCards;
      });
  };

  removeBitpayDebitCard(network: string, cardEid: string): Promise<void> {
    return this.getBitpayAccounts(network)
      .then(allAccounts => {
        return _.each(allAccounts, function (account) {
          account.cards = _.reject(account.cards, {
            eid: cardEid
          });
        });
      }).then(allAccounts => {
        return this.set(Keys.BITPAY_ACCOUNTS_V2(network), allAccounts);
      });
  };

  async getHiddenUnlockRequestsAddresses() {
    let addresses = await this.storage.get(Keys.HIDDEN_REQUESTS_ADDRESSES);
    return addresses || [];
  }

  async setHiddenUnlockRequestsAddresses(addresses:Array<string>) {
    return this.storage.set(Keys.HIDDEN_REQUESTS_ADDRESSES, addresses);
  }

  async getActiveRequestsNumber() {
    let requests = await this.storage.get(Keys.ACTIVE_UNLOCK_REQUESTS_NUMBER);
    return requests || 0;
  }

  setActiveRequestsNumber(requests:number) {
   return  this.storage.set(Keys.ACTIVE_UNLOCK_REQUESTS_NUMBER, requests);
  }


  private get(key: any) {
    return this.storage.get(key);
  }

  private set(key: string, value: any) {
    return this.storage.set(key, _.clone(value));
  }

  private remove(key: any) {
    return this.storage.remove(key)
  }
}
