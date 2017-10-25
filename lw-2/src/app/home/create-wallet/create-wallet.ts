import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ConfigService} from "../../../../providers/config";


@IonicPage({
  defaultHistory: ['ProfileView']
})
@Component({
  selector: 'page-create-wallet',
  templateUrl: 'create-wallet.html',
})
export class CreateWalletView {

  public formData = {walletName: '', beacon: '', bwsurl: '', seedSource: '', seedOptions: [], encrypted: false, passphrase: '', createPassphrase: '', repeatPassword: ''};

  public seedOptions = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private config:ConfigService
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
    return true;
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
}

