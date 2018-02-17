import * as _ from 'lodash';
import { IDisplayTransaction, ITransactionIO, TransactionAction } from '../models/transaction';
import { ContactsProvider } from '../providers/contacts/contacts';
import { IDisplayWallet } from '../models/display-wallet';

export async function formatWalletHistory(walletHistory: IDisplayTransaction[], wallet: IDisplayWallet, contactsProvider?: ContactsProvider): Promise<IDisplayTransaction[]> {
  if (_.isEmpty(walletHistory)) return [];

  walletHistory = _.sortBy(walletHistory, 'time');

  let pendingString;

  walletHistory = await Promise.all(walletHistory.map(async (tx: IDisplayTransaction, i: number) => {
    if (!_.isNil(tx) && !_.isNil(tx.action)) {
      pendingString = tx.isPendingEasySend ? '(pending) ' : '';

      const { alias: inputAlias, address: inputAddress } = tx.outputs.find((input: ITransactionIO) => !input.isMine) || <any>{};
      const { alias: outputAlias, address: outputAddress } = tx.outputs.find((output: ITransactionIO) => !output.isMine) || <any>{};

      tx.input = inputAlias || 'Anonymous';
      tx.output = outputAlias || 'Anonymous';
      tx.addressFrom = inputAlias || inputAddress;
      tx.addressTo = outputAlias || outputAddress;

      tx.from = {
        alias: inputAlias,
        address: inputAddress
      };

      tx.to = {
        alias: outputAlias,
        address: outputAddress
      };

      let inputContact, outputContact;

      if (contactsProvider) {
        try {
          inputContact = await contactsProvider.get(inputAddress || inputAlias);
          tx.input = inputContact.name.formatted;
        } catch (e) {}

        try {
          outputContact = await contactsProvider.get(outputAddress || outputAlias);
          tx.output = outputContact.name.formatted;
        } catch (e) {}
      }

      switch (tx.action) {
        case TransactionAction.SENT:
          tx.type = 'debit';
          tx.name = tx.input;
          tx.contact = outputContact;
          break;

        case TransactionAction.RECEIVED:
          tx.type = 'credit';
          tx.name = (i === 0 && tx.isInvite === true) ? 'Wallet Unlocked' : tx.output;
          tx.contact = inputContact;
          break;

        case TransactionAction.MOVED:
          tx.actionStr = 'Moved Merit';
          tx.name = tx.isInvite ? 'Moved Invite' : 'Moved Merit';
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
