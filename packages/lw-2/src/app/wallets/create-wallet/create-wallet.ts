import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";
import { WalletService } from "merit/wallets/wallet.service";


@IonicPage({
  defaultHistory: ['ProfileView']
})
@Component({
  selector: 'view-create-wallet',
  templateUrl: 'create-wallet.html',
})
export class CreateWalletView {

  public formData = {walletName: '', unlockCode: '', bwsurl: '', seedSource: '', seedOptions: [], encrypted: false, passphrase: '', createPassphrase: '', repeatPassword: ''};

  public seedOptions = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private config:ConfigService,
    private walletService:WalletService
  ) {
    this.formData.bwsurl = config.getDefaults().bws.url;

    this.formData.seedOptions = [{
        id: 'new',
        label: 'Random',
        supportsTestnet: true
      }, {
        id: 'set',
        label: 'Specify Recovery Phrase...',
        supportsTestnet: false
      }
    ]
    this.formData.seedSource = this.formData.seedOptions[0];
  }

  isCreationEnabled() {
    return (
      this.formData.unlockCode
      && this.formData.walletName
    );
  }

  ionViewDidLoad() {
    //do something here
  }

  setSeedSource(source) {
    this.formData.seedSource       = source;
    this.formData.createPassphrase = '';
    this.formData.repeatPassword   = '';
    this.formData.passphrase       = '';
  }
  
  createWallet() {
    let opts = {
      name: this.formData.walletName,
      unlockCode: this.formData.unlockCode,
      bwsurl: this.formData.bwsurl,
      networkName: 'testnet', //todo temp!
      m: 1, //todo temp!
      n: 1 //todo temp!
    };
    
    this.walletService.createWallet(opts).then(() => {
      this.navCtrl.pop();
    })
  }
}

