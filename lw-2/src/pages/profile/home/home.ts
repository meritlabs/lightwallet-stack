import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

class WalletMock {
  name =  'Wallet Mock';
  id = 'id123';
  status = {totalBalanceStr: '0 bits', totalBalanceAlternative: '0.0', alternativeIsoCode: 'USD', totalBalanceMicros: 0, spendableAmount: 0};
  private complete = true;
  isComplete = () => { return this.complete; };
  balanceHidden =  false;
  color =  'darkred';
  locked = false;
  cachedBalance:string;
  cachedBalanceUpdatedOn:number;
  m = 1;
  n = 1;
  error = false;
  canSign = () => { return true; };
  getPrivKeyExternalSourceName = () => { return ''; };
  isPrivKeyExternal = () => { return false; };
  isPrivKeyEncrypted = () => { return false; };

  constructor(fields:any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }
}

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  private totalAmount = 0;
  public totalAmountFormatted = '0 bits';

  public wallets = [
    new WalletMock({name: 'Empty wallet'}),
    new WalletMock({color: 'orange', name: 'Hidden balance wallet', balanceHidden: true}),
    new WalletMock({color: 'darkblue', name: 'Cached balance wallet', cachedBalance: '10 bits', cachedBalanceUpdatedOn: 1508229051}),
    new WalletMock({color: 'red', name: 'Locked wallet', locked: true }),
    new WalletMock({color: 'darkgreen', name: 'Incomplete wallet', complete: false}),
    new WalletMock({color: undefined, name: 'Multisig wallet', m: 2}),
    new WalletMock({color: 'darkcyan', name: 'Processing wallet', status: {totalBalanceStr: '10 bits', totalBalanceMicros: 10, spendableAmount: 0}}),
    new WalletMock({color: 'darkslateblue', name: 'Error wallet', error: 'Some error'}),
  ];
  public proposals = [];
  public transactions = [];

  //private navCtrl:NavController;

  constructor(
    public navParams: NavParams,
    private navCtrl:NavController,
    private app:App
  ) {
    //this.navCtrl = app.getRootNavs()[0];
  }

  doRefresh(refresher) {
    refresher.complete();
  }

  ionViewDidLoad() {
    //do something here
  }

  openWallet(wallet) {
    if (!wallet.isComplete) {
      this.navCtrl.push('CopayersPage')
    } else {
      this.navCtrl.push('WalletPage', {walletId: wallet.id, wallet: wallet});
    }
  }

  toAddWallet() {
    this.navCtrl.push('CreateWalletPage');
  }

  toImportWallet() {
    this.navCtrl.push('ImportPage');
  }


}
