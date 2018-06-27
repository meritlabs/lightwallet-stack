import { EasySend, getEasySendURL } from '@merit/common/models/easy-send';
import * as _ from 'lodash';
import { IDisplayTransaction, ITransactionIO, TransactionAction, VisitedTransaction } from '@merit/common/models/transaction';
import { ContactsService } from '@merit/common/services/contacts.service';
import { MeritWalletClient } from "@merit/common/merit-wallet-client";
import { FeeService } from "@merit/common/services/fee.service";

export async function formatWalletHistory(walletHistory: IDisplayTransaction[], wallet: MeritWalletClient, easySends: EasySend[] = [], feeService: FeeService, contactsProvider?: ContactsService,visitedTransactions?: VisitedTransaction[]): Promise<IDisplayTransaction[]> {
  if (_.isEmpty(walletHistory)) return [];

  const easyReceiveFee = await feeService.getEasyReceiveFee();

  walletHistory = _.sortBy(walletHistory, 'time');

  const easySendsByAddress = {};

  easySends.forEach((easySend: EasySend) => {
    if (easySend && easySend.scriptAddress) {
      easySendsByAddress[easySend.scriptAddress] = easySend;
    }
  });

  let meritMoneyAddresses = []; // registering merit money transactions so we can hide bound invite transactions

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

      const { alias: inputAlias, address: inputAddress } = tx.inputs.find((input: ITransactionIO) => input.isMine === !received) || <any>{};
      const { alias: outputAlias, address: outputAddress } = tx.outputs.find((output: ITransactionIO) => output.isMine === received) || <any>{};

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
        } else {
          const output = tx.outputs.find(o => o.isMine);

          if (output && output.index !== 0) {
            // Ambassador reward
            tx.name = 'Growth Reward';
            tx.action = TransactionAction.AMBASSADOR_REWARD;
            tx.isGrowthReward = true;
          } else {
            tx.name = 'Mining Reward';
            tx.action = TransactionAction.MINING_REWARD;
            tx.isMiningReward = true;
          }
        }
      } else {
        if (tx.outputs.some(o => o.amount == 0 && _.get(o, 'data', '').toLowerCase().indexOf('pool') > -1)) {
          tx.name = 'Pool Reward';
          tx.action = TransactionAction.POOL_REWARD;
          tx.isPoolReward = true;
        }
      }
    }

    if (easySendsByAddress[tx.addressTo]) {
      const easySend = easySendsByAddress[tx.addressTo];
      tx.name = tx.isInvite ? 'MeritInvite' : 'MeritMoney';
      tx.type = tx.isInvite ? 'meritinvite' : 'meritmoney';
      tx.easySend = easySend;
      tx.easySendUrl = getEasySendURL(easySend);
      tx.cancelled = easySend.cancelled;
      if (tx.type == 'meritmoney') {
        meritMoneyAddresses.push(tx.addressTo);
        tx.fees += easyReceiveFee;
        tx.amount -= easyReceiveFee;
      }
    }

    tx.isNew = false;

    // if (visitedTransactions) {
    //   const found = visitedTransactions.find(visTx => visTx.txid === tx.txid);
    //   if (found && found.counter > 2) {
    //     tx.isNew = false;
    //   }
    // }

    // let visitedTxs = await this.persistenceService.getVisitedTransactions() || [];
    // let oneVisited = visitedTxs.find(visTx => visTx.txid === tx.txid);
    // if (oneVisited) {
    //   // already there increase counter
    //   if (oneVisited.counter < 5) {
    //     oneVisited.counter++;
    //   }
    // } else {
    //   // add new one in visited list
    //   visitedTxs.push(new VisitedTransaction(tx.txid, 1));
    // }
    // this.persistenceService.setVisitedTransactions(visitedTxs);

    return tx;
  }));
  // remove meritmoney invites so we  have only one tx for meritmoney
  return walletHistory
    .filter(t => {

      if (meritMoneyAddresses.indexOf(t.addressFrom) != -1) return false; //filtering out txs from cancelled MeritMoney/MeritInvite

      if (t.type == 'meritinvite') {
        if (meritMoneyAddresses.indexOf(t.addressTo) != -1) return false; //filtering out invites txs that were part of MeritMoney
      }

      return true;
    })
    .reverse();
}
