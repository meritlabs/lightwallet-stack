import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { WalletService } from "merit/wallets/wallet.service";
import { PersistenceService } from "merit/core/persistence.service";
import { AppService } from 'merit/core/app-settings.service';
import * as FileSaver from 'file-saver';
import { BwcService } from "merit/core/bwc.service";
import { MeritToastController } from "merit/core/toast.controller";
import { ToastConfig } from "merit/core/toast.config";


@IonicPage()
@Component({
  selector: 'view-export-wallet',
  templateUrl: 'export-wallet.html',
})
export class ExportWalletView {

  private sjcl;

  public wallet:any;

  public segment = 'file';

  public accessGranted:boolean;

  public formData = {
    password: '',
    repeatPassword:''
  };

  public qrcode:string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private walletsService:WalletService,
    private alertController:AlertController,
    private persistanceService:PersistenceService,
    private appService: AppService,
    private bwcService:BwcService,
    private toastCtrl:MeritToastController
  ) {
    this.wallet = this.navParams.get('wallet');

    this.sjcl = this.bwcService.getSJCL();
  }

  ionViewDidLoad() {

    let setQrInfo = (password) => {
      this.walletsService.getEncodedWalletInfo(this.wallet, password).then((info) => {
        console.log('qr info', info);
        this.qrcode = info;
      });
    };

    if (this.walletsService.isEncrypted(this.wallet)) {

      let showPrompt = (highlightInvalid = false) => {
        this.alertController.create({
          title: 'Enter spending password',
          message: 'Spending password required to export this wallet. This is not the password you will use to protect exported file.',
          cssClass: highlightInvalid ? 'invalid-input-prompt' : '',
          inputs: [{
            name: 'password',
            placeholder: 'Password',
            type: 'password'
          }],
          buttons: [
            { text: 'Cancel', role: 'cancel',handler: () => { this.navCtrl.pop();}  },
            { text: 'Ok', handler: (data) => {
                if (!data.password) {
                    showPrompt(true);
                } else {
                  this.walletsService.decrypt(this.wallet,  data.password).then(() => {
                   setQrInfo(data.password);
                    this.accessGranted = true;
                  }).catch((err) => { showPrompt() })
                }
              }
            }
          ]
        }).present();
      };
      showPrompt();
    } else {
      setQrInfo(null);
      this.accessGranted = true;
    }
  }

  saveEnabled() {
    return (
      this.formData.password
      && this.formData.password == this.formData.repeatPassword
    )
  }

  async download() {

      let addressbook = await this.persistanceService.getAddressbook(this.wallet.credentials.network);

      let exportData = this.wallet.export({addressBook: addressbook});
      let encryptedData = this.sjcl.encrypt(this.formData.password, exportData, {iter: 10000});
      let walletName = this.wallet.alias ? `${this.wallet.alias}-${this.wallet.credentials.walletName}` : this.wallet.credentials.walletName;
      let info = await this.appService.getInfo();
      console.log(info);
      let fileName = `${walletName}-${info.nameCase || ''}.backup.aes.json`;

      let blob = new Blob([encryptedData], {type: 'text/plain;charset=utf-8'});
      FileSaver.saveAs(blob, fileName);

      return this.toastCtrl.create({message: 'Wallet exported',  cssClass: ToastConfig.CLASS_MESSAGE});

  }

}
