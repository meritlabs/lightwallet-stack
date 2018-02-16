import * as _ from 'lodash';
import { IDisplayTransaction, TransactionAction } from '../models/transaction';
import { ContactsProvider } from '../providers/contacts/contacts';
import { IDisplayWallet } from '../models/display-wallet';

export async function formatWalletHistory(walletHistory: IDisplayTransaction[], wallet: IDisplayWallet, contactsProvider?: ContactsProvider): Promise<IDisplayTransaction[]> {
  if (_.isEmpty(walletHistory)) return [];

  walletHistory = _.sortBy(walletHistory, 'time');

  let pendingString;

  walletHistory = await Promise.all(walletHistory.map(async (tx: IDisplayTransaction, i: number) => {
    if (!_.isNil(tx) && !_.isNil(tx.action)) {
      pendingString = tx.isPendingEasySend ? '(pending) ' : '';

      const { alias: inputAlias, address: inputAddress } = tx.inputs ? tx.inputs[0] : <any>{};
      const { alias: outputAlias, address: outputAddress } = tx.outputs ? tx.outputs[0] : <any>{};

      tx.input = inputAlias || 'Anonymous';
      tx.output = outputAlias || 'Anonymous';
      tx.addressFrom = inputAlias || inputAddress;
      tx.addressTo = outputAlias || outputAddress;

      if (contactsProvider) {
        try {
          tx.input = (await contactsProvider.get(inputAddress || inputAlias)).name.formatted;
        } catch (e) {
          console.log(e);
        }

        try {
          tx.output = (await contactsProvider.get(outputAddress || outputAlias)).name.formatted;
        } catch (e) {
          console.log(e);
        }
      }

      switch (tx.action) {
        case TransactionAction.SENT:
          tx.type = 'debit';
          tx.name = tx.input;
          break;

        case TransactionAction.RECEIVED:
          tx.type = 'credit';
          tx.name =  (i === 0 && tx.isInvite === true) ? 'Wallet unlocked' : tx.output;
          break;

        case TransactionAction.MOVED:
          tx.actionStr = 'Moved Merit';
          tx.name = tx.isInvite? 'Moved Invite' : 'Moved Merit';
          break;
      }
      tx.actionStr = pendingString + tx.actionStr;

      if (wallet && !tx.walletId) {
        tx.walletId = wallet.id;
      }

      if (tx.isCoinbase) {
        if (tx.isInvite) {
          tx.name = 'Mined Invite';
          tx.action = TransactionAction.INVITE;
          tx.type = 'credit';
        } else if (tx.outputs[0].index === 0) {
          tx.name = 'Mining Reward';
          tx.action = TransactionAction.MINING_REWARD;
        } else {
          tx.name = 'Ambassador Reward';
          tx.action = TransactionAction.AMBASSADOR_REWARD;
        }
      }
    }

    return tx;
  }));

  return walletHistory.reverse();
}
