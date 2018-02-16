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
          tx.input = (await contactsProvider.get(tx.input)).name.formatted;
        } catch (e) {}

        try {
          tx.output = (await contactsProvider.get(tx.output)).name.formatted;
        } catch (e) {}
      }

      switch (tx.action) {
        case TransactionAction.SENT:
          tx.type = 'debit';
          tx.addressFrom = wallet.alias || wallet.name;

          const { alias, address } = tx.inputs[0];

          tx.name = tx.input;

          if (contactsProvider) {
            contactsProvider.get(alias || address);
          }

          if (tx.confirmations == 0) {
            tx.actionStr = 'Sending Payment...';
          } else {
            tx.actionStr = 'Payment Sent';
          }
          break;

        case TransactionAction.RECEIVED:
          tx.addressTo = wallet.name;
          tx.type = 'credit';
          tx.name =  (i === 0 && tx.isInvite === true) ? 'Wallet unlocked' : tx.output;

          if (tx.confirmations == 0) {
            tx.actionStr = 'Receiving Payment...';
          } else {
            tx.actionStr = 'Payment Received';
          }
          break;

        case TransactionAction.MOVED:
          tx.actionStr = 'Moved Merit';
          tx.name = tx.isInvite? 'Moved Invite' : 'Moved Merit';
          break;

        default:
          tx.actionStr = 'Recent Transaction';
          break
      }
      tx.actionStr = pendingString + tx.actionStr;

      if (wallet && !tx.walletId) {
        tx.walletId = wallet.id;
      }

      if (tx.isCoinbase && !tx.isInvite) {
        if (tx.outputs[0].index === 0) {
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
