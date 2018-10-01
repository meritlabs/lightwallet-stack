import { Component, OnInit } from '@angular/core';
import { Script } from 'merit-lib';

import { ENV } from '@app/env';
import { ProfileService } from '@merit/common/services/profile.service';
import { RateService } from '@merit/common/services/rate.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { getQueryParam } from '@merit/common/utils/url';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';

@Component({
  selector: 'view-escrow-payment',
  templateUrl: './escrow-payment.view.html',
  styleUrls: ['./escrow-payment.view.sass']
})
export class EscrowPaymentView implements OnInit {
  error: string;
  wallet: MeritWalletClient;
  txp: any;

  amount = +getQueryParam('a');
  amountInMrt = this.rateService.microsToMrt(this.amount);
  sendFrom = getQueryParam('pa');
  sendTo = getQueryParam('ea');
  entitiesType = getQueryParam('t');
  entitiesIds = getQueryParam('ids');
  fee = 0;
  feeCalculated = false;
  sending = false;
  success = false;

  constructor(
    private profileService: ProfileService,
    private rateService: RateService,
    private passwordPromptCtrl: PasswordPromptController,
  ) {}

  async ngOnInit() {
    const wallets = await this.profileService.getWallets();
    this.wallet = wallets.find(wallet => wallet.getRootAddress().toString() === this.sendFrom);

    if (!this.wallet) {
      this.error = 'No wallet found. Try to logout and login to market.';
      return;
    }

    await this.wallet.getStatus();
    await this.buildTxp();
  }

  async buildTxp() {
    this.feeCalculated = false;

    const opts = {
      outputs: [{
        amount: this.amount,
        toAddress: this.sendTo,
      },
      {
        script: Script.buildDataOut(`MeritMarket:${this.entitiesType}:${this.entitiesIds}`).toHex(),
        amount: 0
      }],
      validateOutputs: false,
    };

    if (this.wallet.balance.spendableAmount < this.amount) {
      this.error = 'Insufficient funds';
      return;
    }

    try {
      this.txp = await this.wallet.createTxProposal(opts);
    } catch (e) {
      if (e.message) {
        this.error = e.message;
      } else {
        this.error = 'An error occured calculating fee. Try again later';
      }
      return;
    }

    this.fee = this.rateService.microsToMrt(this.txp.fee);
    this.feeCalculated = true;
  }

  async send() {
    this.error = null;
    this.sending = true;

    if (this.wallet.credentials.isPrivKeyEncrypted()) {
      this.passwordPromptCtrl.createForWallet(this.wallet).onDidDismiss(async (password: string) => {
        if (password) {
          await this.sendTx(password);
        } else {
          this.error = 'Wrong password';
        }
        this.sending = false;
      });
    } else {
      await this.sendTx();
      this.sending = false;
    }
  }

  private async sendTx(password?: string) {
    try {
      this.txp = await this.wallet.publishTxProposal({ txp: this.txp });
      // TODO: add wallet password support
      this.txp = await this.wallet.signTxProposal(this.txp, password);
      this.txp = await this.wallet.broadcastTxProposal(this.txp);

      this.success = true;

      const message = JSON.stringify({
        message: "Lightwallet.Market.SendToEscrow",
        data: { ok: true, txid: this.txp.txid }
      });
      window.opener.postMessage(message, ENV.marketUrl);
    } catch (e) {
      this.error = e.message;
    }
  }

  cancel() {
    const message = JSON.stringify({
      message: "Lightwallet.Market.SendToEscrow",
      data: { ok: false }
    });
    window.opener.postMessage(message, ENV.marketUrl);
  }
}
