import * as _ from 'lodash';
import { IDisplayTransaction, TransactionAction } from '../models/transaction';
import { ContactsProvider } from '../providers/contacts/contacts';
import { IDisplayWallet } from '../models/display-wallet';

export function formatWalletHistory(walletHistory: any[], wallet: IDisplayWallet, contactsProvider?: ContactsProvider): any[] {
  if (_.isEmpty(walletHistory)) return [];

  let pendingString;

  return walletHistory.map((tx: IDisplayTransaction) => {
    if (!_.isNil(tx) && !_.isNil(tx.action)) {
      pendingString = tx.isPendingEasySend ? '(pending) ' : '';
      switch (tx.action) {
        case TransactionAction.SENT:
          tx.type = 'debit';
          tx.addressFrom = wallet.alias || wallet.name;
          tx.name =  _.get(_.find(<any>tx.outputs, { isMine: false }), 'alias', '') || wallet.name;

          if (tx.isInvite === true) {
            tx.name = 'Invite Sent';
          } else if (tx.confirmations == 0) {
            tx.actionStr = 'Sending Payment...';
          } else {
            tx.actionStr = 'Payment Sent';
          }
          break;

        case TransactionAction.RECEIVED:
          tx.addressTo = wallet.name;
          tx.type = 'credit';
          tx.name =  _.get(_.find(<any>tx.inputs, { isMine: false }), 'alias', '') || wallet.name;

          if (tx.isInvite === true) {
            tx.name = 'Invite Received'
          } else if (tx.confirmations == 0) {
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
  });
}
