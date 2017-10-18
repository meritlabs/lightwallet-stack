import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

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
  selector: 'page-receive',
  templateUrl: 'receive.html',
})
export class ReceivePage {

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
  public wallet:WalletMock;

  public protocolHandler: string;
  public address: string;
  public qrAddress: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ModalCtrl:ModalController
  ) {
    this.protocolHandler = "bitcoin";
    this.address = "1FgGP9dKqtWC1Q9xGhPYVmAeyezeZCFjhf";
    this.updateQrAddress();
    this.wallet = this.wallets[0];
    console.log(this.wallet);
  }

  ionViewDidLoad() {
    //do something here
  }

  requestSpecificAmount() {
    //this.navCtrl.push(AmountPage, {address: this.address, sending: false});
  }

  setAddress() {
    this.address = this.address === "1FgGP9dKqtWC1Q9xGhPYVmAeyezeZCFjhf" ? "1RTes3reeRTs1Q9xGhPYVmQFrdUyCr3EsX" : "1FgGP9dKqtWC1Q9xGhPYVmAeyezeZCFjhf";
    this.updateQrAddress();
  }

  updateQrAddress () {
    this.qrAddress = this.protocolHandler + ":" + this.address;
  }

  selectWallet() {
    this.ModalCtrl.create('SelectWalletModal').present();
  }

}


