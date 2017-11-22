import * as Promise from 'bluebird';
import { Injectable } from "@angular/core";
import { MeritWalletClient } from "src/lib/merit-wallet-client";
import { BwcError } from 'src/lib/merit-wallet-client/lib/errors';
import { EasySend } from 'merit/transact/send/easy-send/easy-send.model';

@Injectable()
export class EasySendService {
  constructor() {}
  public createEasySendScriptHash(wallet: MeritWalletClient): Promise<EasySend> {

    // TODO: get a passphrase from the user
    let opts = {
      network: wallet.network,
      passphrase: 'donkey'
    };

    return wallet.buildEasySendScript(opts).then((easySend) => {
      let unlockScriptOpts = {
        unlockCode: wallet.shareCode,
        address: easySend.script.toAddress().toString(), // not typechecked yet
        network: opts.network
      };
      return wallet.unlockAddress(unlockScriptOpts).then(() => {
        let unlockRecipientOpts = {
          unlockCode: wallet.shareCode,
          address: easySend.receiverPubKey.toAddress().toString(), // not typechecked yet
          network: opts.network
        };
        return wallet.unlockAddress(unlockRecipientOpts);
      }).then(() => {
        return Promise.resolve(easySend);
      });
    }).catch((err) => {
      return Promise.reject(new BwcError('error building easysend script' + err));
    })

  }
}