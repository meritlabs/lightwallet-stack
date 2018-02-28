import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-backup',
  templateUrl: 'backup.html',
})
export class BackupView {
  public mnemonic: string;

  constructor(public alertController: AlertController,
              private navCtrl: NavController,
              private navParams: NavParams) {
    this.mnemonic = this.navParams.get('mnemonic');
  }

  async toTransactView() {
    // Now that we are unlocked, we no longer need these other views in the stack,
    // so we shall destroy them.
    await this.navCtrl.setRoot('TransactView');
    return this.navCtrl.popToRoot();
  }

  public skipBackupPrompt(): void {
    this.alertController.create({
      title: 'No backup, no Merit',
      message: 'If you lose your wallet without a backup, it is lost for good!',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Ok', handler: this.toTransactView.bind(this) }
      ]
    }).present();
  }
}
