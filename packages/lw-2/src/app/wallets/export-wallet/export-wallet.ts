import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {WalletService} from "../wallet.service";


@IonicPage()
@Component({
  selector: 'view-export-wallet',
  templateUrl: 'export-wallet.html',
})
export class ExportWalletView {


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
    private alertController:AlertController
  ) {
    this.wallet = this.navParams.get('wallet');
  }

  ionViewDidLoad() {

    let setQrInfo = (password) => {
      this.walletsService.getEncodedWalletInfo(this.wallet, password).then((info) => {
        this.qrcode = info;
      });
    };

    if (this.walletsService.isEncrypted(this.wallet)) {

      let showPrompt = (highlightInvalid = false) => {
        this.alertController.create({
          title: 'Password required',
          message: 'Enter spending password',
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
        })
      }
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

  download() {
    //todo add download mechanism
  }

}
