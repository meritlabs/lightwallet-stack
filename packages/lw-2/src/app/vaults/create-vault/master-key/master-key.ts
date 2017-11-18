import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { PopupService } from "merit/core/popup.service";
import { BwcService } from 'merit/core/bwc.service';
import { MeritWalletClient, IMeritWalletClient} from './../../../../lib/merit-wallet-client';

@IonicPage({
  defaultHistory: ['ProfileView']
})
@Component({
  selector: 'view-create-vault-master-key',
  templateUrl: 'master-key.html',
})
export class CreateVaultMasterKeyView {

  public formData = { masterKey: null, masterKeyMnemonic: null};

  private walletClient: IMeritWalletClient;
  private bitcore: any

  constructor(
    private navCtrl:NavController,
    private navParams: NavParams,
    private createVaultService: CreateVaultService,
    private popupService: PopupService,
    private bwcService: BwcService,
  ){}

  ionViewDidLoad() {

    this.walletClient = this.bwcService.getClient(null, {});
    this.bitcore = this.bwcService.getBitcore();

    let data = this.createVaultService.getData();

    if(!data.masterKey) {
      let network = this.navParams.data.network || 'testnet';
      let masterKey = this.bitcore.PrivateKey.fromRandom(network);
      let masterKeyMnemonic = this.walletClient.getNewMnemonic(masterKey.toBuffer());

      data.masterKey = masterKey;
      data.masterKeyMnemonic = masterKeyMnemonic;

      this.createVaultService.updateData(data);
      data = this.createVaultService.getData();
    }

    this.formData.masterKey = data.masterKey;
    this.formData.masterKeyMnemonic = data.masterKeyMnemonic.toString();
  }

  confirm() {
    let confirm = () => {
      this.toVautlSummary();
    };
    this.popupService.ionicConfirm('Master key', 'Did you copy the master key?', 'Yes', 'No').then(() => confirm.bind(this));
  }

  toVautlSummary() {
    this.navCtrl.push('CreateVaultSummaryView');
  }
}
