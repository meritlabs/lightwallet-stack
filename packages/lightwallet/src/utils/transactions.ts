import * as _ from 'lodash';
import { MeritWalletClient } from '../lib/merit-wallet-client';

export function formatWalletHistory(walletHistory: any[], wallet?: any): any[] {
  if (_.isEmpty(walletHistory)) return [];

  console.log(walletHistory, wallet);

  let pendingString;

  return walletHistory.map((history: any) => {
    if (!_.isNil(history) && !_.isNil(history.action)) {
      pendingString = history.isPendingEasySend ? '(pending) ' : '';
      switch (history.action) {
        case 'sent':
          if (history.confirmations == 0) {
            history.actionStr = 'Sending Payment...';
          } else {
            history.actionStr = 'Payment Sent';
          }

          history.addressFrom = wallet.name;
          break;
        case 'received':
          if (history.confirmations == 0) {
            history.actionStr = 'Receiving Payment...';
          } else {
            history.actionStr = 'Payment Received';
          }
          history.addressTo = wallet.name;
          break;
        case 'moved':
          history.actionStr = 'Moved Merit';
          break;
        default:
          history.actionStr = 'Recent Transaction';
          break
      }
      history.actionStr = pendingString + history.actionStr;

      history.type = ['received', 'receiving'].indexOf(history.action) > -1 ? 'credit' : 'debit';

      if (wallet && !history.walletId) {
        history.walletId = wallet.id;
      }

      if (history.isCoinbase) {
        // mining rewards
        history.name = 'Mining rewards';
      } else {
        // user sent Merit to someone else
        // TODO get contact name if wallet address is in address box
        const alias = history.inputs[0].alias;
        history.name = alias ? `@${alias}` : history.inputs[0].address;
      }
    }

    console.log(history);
    return history;
  });
}
