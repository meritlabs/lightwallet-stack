import * as _ from 'lodash';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'view-backup',
  templateUrl: 'backup.html',
})
export class BackupView {
  public mnemonic: string;

  constructor(
    public alertController: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {}

  ionViewDidLoad(): void {
    this.mnemonic = this.navParams.get('mnemonic');
  }

  public toVerify(): void {
    this.navCtrl.push('VerifyBackupView', {
      mnemonic: this.mnemonic
    })
  }

  public toTransactView(): void {
    // Now that we are unlocked, we no longer need these other views in the stack,
    // so we shall destroy them.
    this.navCtrl.setRoot('TransactView');
    this.navCtrl.popToRoot();
  }

  public skipBackupPrompt(): void {
    this.alertController.create({
      title: 'No backup, no Merit',
      message: 'If you lose your wallet without a backup, it is lost for good!',
      buttons: [
        { text: 'Cancel', role: 'cancel', handler: _.noop },
        { text: 'Ok', handler: this.toTransactView }
      ]
    }).present();
  }
}
