import { Component } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { FeeService } from 'merit/shared/fee/fee.service';

@Component({
  templateUrl: 'fee-level-modal.html'
})
export class FeeLevelModal {
  public network: any;
  public feeLevel: any;
  public noSave: any;
  public customFeePerKB: any;
  public feePerMicrosByte: any;
  public avgConfirmationTime?: any;
  public showMinWarning: Boolean;
  public showMaxWarning: Boolean;
  public showError: Boolean;
  public loadingFee: Boolean;
  public minFeeAllowed: number;
  public maxFeeAllowed: number;
  public maxFeeRecommended: number;
  public selectedFee: {value: any};

  constructor(
    private navParams: NavParams,
    private feeService: FeeService,
    private viewCtrl: ViewController
  ) {
    this.network = navParams.data.network;
    this.feeLevel = navParams.data.feeLevel;
    this.noSave = navParams.data.noSave;
    this.customFeePerKB = navParams.data.customFeePerKB;
    this.feePerMicrosByte = navParams.data.feePerMicrosByte;
  }
  public ok(): void {
    this.viewCtrl.dismiss({
      selectedFee: this.selectedFee.value,
      customFeePerKB: this.customFeePerKB
    });
  }
  public checkFees(): void {}
  public feeOptValues = this.feeService.getFeeOptValues;
}
