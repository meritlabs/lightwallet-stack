
import { Injectable } from '@angular/core';
import { Logger } from '@nsalaun/ng-logger';
import { LoadingController } from 'ionic-angular';

import * as _ from 'lodash';


@Injectable()
export class SpinnerService {
  constructor(
    private logger: Logger,
    public loadingCtrl: LoadingController
  ) {
    console.log("Loaded the spinner service.");
  }

  // TODO: Update this with the final list of relevant processes.
  private loadingMessages = {
    'broadcastingTx': 'Broadcasting transaction',
    'calculatingFee': 'Calculating fee',
    'connectingCoinbase': 'Connecting to Coinbase...',
    'connectingGlidera': 'Connecting to Glidera...',
    'connectingledger': 'Waiting for Ledger...',
    'connectingtrezor': 'Waiting for Trezor...',
    'creatingTx': 'Creating transaction',
    'creatingWallet': 'Creating Wallet...',
    'deletingWallet': 'Deleting Wallet...',
    'extractingWalletInfo': 'Extracting Wallet information...',
    'fetchingPayPro': 'Fetching payment information',
    'generatingCSV': 'Generating .csv file...',
    'gettingFeeLevels': 'Getting fee levels...',
    'importingWallet': 'Importing Wallet...',
    'joiningWallet': 'Joining Wallet...',
    'recreating': 'Recreating Wallet...',
    'rejectTx': 'Rejecting payment proposal',
    'removeTx': 'Deleting payment proposal',
    'retrievingInputs': 'Retrieving inputs information',
    'scanning': 'Scanning Wallet funds...',
    'sendingTx': 'Sending transaction',
    'signingTx': 'Signing transaction',
    'sweepingWallet': 'Sweeping Wallet...',
    'validatingWords': 'Validating recovery phrase...',
    'loadingTxInfo': 'Loading transaction info...',
    'sendingFeedback': 'Sending feedback...',
    'generatingNewAddress': 'Generating new address...',
    'sendingByEmail': 'Preparing addresses...',
    'sending2faCode': 'Sending 2FA code...',
    'buyingMerit': 'Buying Merit...',
    'sellingMerit': 'Selling Merit...',
    'fetchingBitPayAccount': 'Fetching BitPay Account...',
    'updatingGiftCards': 'Updating Gift Cards...',
    'updatingGiftCard': 'Updating Gift Card...',
    'cancelingGiftCard': 'Canceling Gift Card...',
    'creatingGiftCard': 'Creating Gift Card...',
    'buyingGiftCard': 'Buying Gift Card...',
    'topup': 'Top up in progress...'
  };
  private currentlyRunning:string[] = [];

  public setSpinnerStatus(processName: string, runningNow: boolean): void {
    this.logger.info("Setting spinner status for: " + processName + "to: " + runningNow);

    if (runningNow) {
      this.currentlyRunning.push(processName);
    } else {
      _.remove(this.currentlyRunning, processName);
    }
    this.renderSpinner();    
  }

  public getSpinnerStatus(processName: string): boolean {
    return this.currentlyRunning.includes(processName);
  }

  // Decide if we want them to automatically dismiss after sometime. 
  private renderSpinner(): void {
    let loadingMessage = this.loadingMessages[_.first(this.currentlyRunning)] || "Loading...";
    const loading = this.loadingCtrl.create({
      content: loadingMessage
    });
    
    if (!_.isEmpty(this.currentlyRunning)) {
      loading.present();
    } else {
      loading.dismissAll();
    }
  }
}