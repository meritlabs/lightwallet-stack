import * as _ from 'lodash';
import { MeritWalletClient } from '../lib/merit-wallet-client';

// TODO create WalletHistory class and move this function in there
export function formatWalletHistory(wh: any[]): any[] {
  if (!_.isEmpty(wh)) {
    return _.map(wh, (h: any) => {
      if (!_.isNil(h) && !_.isNil(h.action)) {
        const pendingString = h.isPendingEasySend ? '(pending) ' : '';
        switch (h.action) {
          case 'sent':
            if (h.confirmations == 0) {
              h.actionStr = 'Sending Payment...';
            } else {
              h.actionStr = 'Payment Sent';
            }
            break;
          case 'received':
            if (h.confirmations == 0) {
              h.actionStr = 'Receiving Payment...';
            } else {
              h.actionStr = 'Payment Received';
            }
            break;
          case 'moved':
            h.actionStr = 'Moved Merit';
            break;
          default:
            h.actionStr = 'Recent Transaction';
            break
        }
        h.actionStr = pendingString + h.actionStr;
      }
      return h;
    });
  } else {
    return [];
  }
}