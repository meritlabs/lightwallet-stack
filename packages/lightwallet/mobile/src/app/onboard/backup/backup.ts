import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
@IonicPage()
@Component({
  selector: 'view-backup',
  templateUrl: 'backup.html',
})
export class BackupView {
  public mnemonic: string;
  public copied: boolean;

  constructor(public alertController: AlertController,
              private navCtrl: NavController,
              private navParams: NavParams,
              private toastCtrl: ToastControllerService
  ) {
    this.mnemonic = this.navParams.get('mnemonic');
  }

  async toTransactView() {
    // Now that we are unlocked, we no longer need these other views in the stack,
    // so we shall destroy them.


    await this.navCtrl.setRoot('TransactView', {unlockUrl: this.navParams.get('unlockUrl')});
    return this.navCtrl.popToRoot();
  }

  public skipBackupPrompt(){
    if (!this.copied) {
      this.alertController.create({
        title: 'No backup, no Merit',
        message: "Have you written your phrase down? You can do it later on wallet export page, but we strongly recommend to do it now so you won't loose access to your Merit",
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          { text: 'Ok', handler: this.toTransactView.bind(this) }
        ]
      }).present();
    } else {
     this.toTransactView();
    }

  }

  public markCopied() {
    this.copied = true;
    this.toastCtrl.success('Copied to clipboard');
  }
}
