import { EasySend, getEasySendURL } from '@merit/common/models/easy-send';
import * as _ from 'lodash';
import { IDisplayTransaction, ITransactionIO, TransactionAction } from '@merit/common/models/transaction';
import { ContactsService } from '@merit/common/services/contacts.service';
import { MeritWalletClient } from "@merit/common/merit-wallet-client";

export async function formatWalletHistory(walletHistory: IDisplayTransaction[], wallet: MeritWalletClient, easySends: EasySend[] = [], contactsProvider?: ContactsService): Promise<IDisplayTransaction[]> {
  if (_.isEmpty(walletHistory)) return [];

  walletHistory = _.sortBy(walletHistory, 'time');

  const easySendsByAddress = {};

  easySends.forEach((easySend: EasySend) => {
    if (easySend.scriptAddress) {
      easySendsByAddress[easySend.scriptAddress] = easySend;
    }
  });

  let pendingString;

  walletHistory = await Promise.all(walletHistory.map(async (tx: IDisplayTransaction, i: number) => {
    if (!_.isNil(tx) && !_.isNil(tx.action)) {
      pendingString = tx.isPendingEasySend ? '(pending) ' : '';

      let received: boolean = false,
        isEasySend: boolean;

      switch (tx.action) {
        case TransactionAction.SENT:
          tx.type = 'debit';
          isEasySend = true;
          break;

        case TransactionAction.RECEIVED:
          tx.type = 'credit';

          if (tx.isInvite) {
            if (i === 0) {
              tx.isWalletUnlock = true;
              tx.name = 'Wallet Unlocked';
            }
          } else {
            isEasySend = true;
          }

          received = true;
          break;

        case TransactionAction.MOVED:
          tx.name = tx.actionStr = tx.isInvite ? 'Moved Invite' : 'Moved Merit';
          break;
      }

      const {alias: inputAlias, address: inputAddress} = tx.inputs.find((input: ITransactionIO) => input.isMine === !received) || <any>{};
      const {alias: outputAlias, address: outputAddress} = tx.outputs.find((output: ITransactionIO) => output.isMine === received) || <any>{};

      tx.input = inputAlias ? '@' + inputAlias : 'Anonymous';
      tx.output = outputAlias ? '@' + outputAlias : 'Anonymous';

      tx.name = tx.name || (received ? tx.input : tx.output);

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

      if (!tx.isCoinbase && !tx.isWalletUnlock && contactsProvider) {
        const contactAddress = received ? inputAddress || inputAlias : outputAddress || outputAlias;

        try {
          tx.contact = contactsProvider.get(contactAddress);
          tx.name = tx.contact ? tx.contact.name.formatted : tx.name;
        } catch (e) {
        }
      }

      tx.actionStr = pendingString + tx.actionStr;

      if (wallet && !tx.walletId) {
        tx.walletId = wallet.id;
        tx.wallet = wallet;
      }

      if (tx.isCoinbase) {
        if (tx.isInvite) {
          tx.name = 'Mined Invite';
          tx.action = TransactionAction.INVITE;
          tx.type = 'credit';
        } else if (tx.outputs[0].index === 0) {
          tx.name = 'Mining Reward';
          tx.action = TransactionAction.MINING_REWARD;
          tx.isMiningReward = true;
        } else {
          tx.name = 'Ambassador Reward';
          tx.action = TransactionAction.AMBASSADOR_REWARD;
          tx.isAmbassadorReward = true;
        }
      }
    }

    if (easySendsByAddress[tx.addressTo]) {
      const easySend = easySendsByAddress[tx.addressTo];
      tx.name = 'Global Send';
      tx.type = 'globalsend';
      tx.easySend = easySend;
      tx.easySendUrl = getEasySendURL(easySend);
    }

    return tx;
  }));

  // remove globalsend invites so we  have only one tx for globalsend
  return walletHistory
    .filter(t => !(t.type == 'globalsend' && t.isInvite))
    .reverse();
}
