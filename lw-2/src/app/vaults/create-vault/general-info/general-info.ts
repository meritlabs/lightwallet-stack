import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";


@IonicPage({
  defaultHistory: ['ProfileView']
})
@Component({
  selector: 'view-create-vault-general',
  templateUrl: 'general-info.html',
})
export class CreateVaultGeneralInfoView {
  constructor(
    private navCtrl:NavController,
    private navParams: NavParams, 
  ){}

  toDeposit() {
    this.navCtrl.push('CreateVaultDepositView');
  }
}