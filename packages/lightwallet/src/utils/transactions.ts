import * as _ from 'lodash';
import { IDisplayTransaction, TransactionAction } from '../models/transaction';
import { ContactsProvider } from '../providers/contacts/contacts';
import { IDisplayWallet } from '../models/display-wallet';

export function formatWalletHistory(walletHistory: any[], wallet: IDisplayWallet, contactsProvider?: ContactsProvider): any[] {
  if (_.isEmpty(walletHistory)) return [];

  console.log(walletHistory, wallet);

  let pendingString;

  return walletHistory.map((history: IDisplayTransaction) => {
    if (!_.isNil(history) && !_.isNil(history.action)) {
      pendingString = history.isPendingEasySend ? '(pending) ' : '';
      switch (history.action) {
        case TransactionAction.SENT:
          if (history.confirmations == 0) {
            history.actionStr = 'Sending Payment...';
          } else {
            history.actionStr = 'Payment Sent';
          }
          history.type = 'debit';
          history.addressFrom = wallet.alias || wallet.name;
          history.name = history.inputs[0].alias || wallet.name;
          break;

        case TransactionAction.RECEIVED:
          if (history.confirmations == 0) {
            history.actionStr = 'Receiving Payment...';
          } else {
            history.actionStr = 'Payment Received';
          }
          history.addressTo = wallet.name;
          history.type = 'credit';
          history.name =  _.get(_.find(<any>history.outputs, { isMine: false }), 'alias', '') || wallet.name;
          break;

        case TransactionAction.MOVED:
          history.actionStr = 'Moved Merit';
          break;

        default:
          history.actionStr = 'Recent Transaction';
          break
      }
      history.actionStr = pendingString + history.actionStr;

      if (wallet && !history.walletId) {
        history.walletId = wallet.id;
      }

      if (history.isCoinbase) {
        // mining rewards
        history.name = 'Mining rewards';
      } else {
        // // user sent Merit to someone else
        // // TODO get contact name if wallet address is in address box
        // const inputAlias: string = history.inputs[0].alias;
        // const outputAlias: string = _.get(_.find(<any>history.outputs, { isMine: false }), 'alias', '');
        //
        // const alias = history.action == 'received' ?  inputAlias: outputAlias;
        // history.name = alias ? `@${alias}` : history.inputs[0].address;
      }
    }

    console.log(history);
    return history;
  });
}
