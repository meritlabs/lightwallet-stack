
import { Injectable } from '@angular/core';
import { Logger } from 'merit/core/logger';
import { LoadingController, NavController } from 'ionic-angular';

import * as _ from 'lodash';


@Injectable()
export class SpinnerService {
  constructor(
    private logger: Logger,
    public loadingCtrl: LoadingController  ) {
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
  private currentSpinner: any;

  public setSpinnerStatus(processName: string, runningNow: boolean, sendToView?: string): void {
    this.logger.info("Setting spinner status for: " + processName + "to: " + runningNow);

    if (runningNow) {
      this.currentlyRunning.push(processName);
    } else {
      _.pull(this.currentlyRunning, processName);
    }
    this.logger.warn("What is currently running?");
    this.logger.warn(this.currentlyRunning);
    this.logger.warn("lodash version is: ", _.VERSION);
    this.renderSpinner(sendToView);    
  }

  public getSpinnerStatus(processName: string): boolean {
    return this.currentlyRunning.includes(processName);
  }

  // Decide if we want them to automatically dismiss after sometime. 
  private renderSpinner(andThenGoTo?: string): void {
    let loadingMessage = this.loadingMessages[_.first(this.currentlyRunning)] || "Loading...";
    this.currentSpinner = this.loadingCtrl.create({
      content: loadingMessage,
      dismissOnPageChange: true,
      duration: 5000
    });
    
    if (!_.isEmpty(this.currentlyRunning)) {
      //TODO: This returns a promise.  Need to resolve it somehow.  
      //Or, at least, tag a handler...
      this.currentSpinner.present().then(() => {
        return Promise.resolve();
      });
    } else {
      this.logger.warn("Attempting to DismissAll");
      this.currentSpinner.dismissAll();
    }
  }
}