import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ENV } from '@app/env';
import { ProfileService } from '@merit/common/services/profile.service';
import { RateService } from '@merit/common/services/rate.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { getQueryParam } from '@merit/common/utils/url';

@Component({
  selector: 'view-escrow-payment',
  templateUrl: './escrow-payment.view.html',
  styleUrls: ['./escrow-payment.view.sass']
})
export class EscrowPaymentView implements OnInit {
  error: string;
  wallet: MeritWalletClient;
  txp: any;

  amountInMrt = +getQueryParam('a');
  sendFrom = getQueryParam('pa');
  sendTo = getQueryParam('ea');
  paymentId = +getQueryParam('pid');
  fee = 0;
  feeCalculated = false;

  constructor(private profileService: ProfileService, private rateService: RateService) {}

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

    const amount = this.rateService.mrtToMicro(this.amountInMrt);

    const opts = {
      outputs: [{
        amount,
        toAddress: this.sendTo,
        message: '' + this.paymentId,
      }]
    };

    if (this.wallet.balance.spendableAmount < amount) {
      this.error = 'Insufficient funds';
      return;
    }

    try {
      this.txp = await this.wallet.createTxProposal(opts);
    } catch (e) {
      this.error = 'An error occured calculating fee. Try again later';
      return;
    }

    this.fee = this.rateService.microsToMrt(this.txp.fee);
    this.feeCalculated = true;
  }

  async send() {
    this.error = null;

    try {

      let txp = await this.wallet.publishTxProposal({ txp: this.txp });
      // TODO: add wallet password support
      txp = await this.wallet.signTxProposal(txp, '');
      txp = await this.wallet.broadcastTxProposal(txp);

      const message = JSON.stringify({
        message: "Lightwallet.Market.SendToEscrow",
        data: { ok: true, txid: txp.txid }
      });
      window.opener.postMessage(message, ENV.marketUrl);

    } catch (e) {
      this.error = e.message;
      return;
    }

    // TODO: REMOVE THIS LINE!!!
    await this.buildTxp();
  }

  cancel() {
    const message = JSON.stringify({
      message: "Lightwallet.Market.SendToEscrow",
      data: { ok: false }
    });
    window.opener.postMessage(message, ENV.marketUrl);
  }
}
