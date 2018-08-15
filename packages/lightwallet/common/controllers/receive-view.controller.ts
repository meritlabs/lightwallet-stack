import { Observable } from 'rxjs/Observable';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { selectConfirmedWallets, selectWalletsLoading } from '@merit/common/reducers/wallets.reducer';
import { ConfigService } from '@merit/common/services/config.service';
import { IRootAppState } from '@merit/common/reducers';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { Store } from '@ngrx/store';
import { getLatestDefinedValue } from '@merit/common/utils/observables';
import { getAddressInfo } from '@merit/common/utils/addresses';
import { mrtToMicro } from '@merit/common/utils/format';

export class ReceiveViewController {
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectConfirmedWallets);
  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);

  hasUnlockedWallet: boolean;

  protocolHandler: string = 'merit';
  address: string;
  alias: string;
  qrAddress: string;
  amount: number = 0;
  amountMicros: number;
  availableUnits: Array<string>;
  amountCurrency: string;
  amountInFiat: any = 0;

  // For now, the first wallet in the list of wallets is the default.
  // TODO(AW): Let's add a setting where the user can choose their default wallet.
  selectedWallet: DisplayWallet;

  selectedCurrency: any = {
    'name': 'USD',
    'symbol': '$',
    'value': 10,
  };

  constructor(private configService: ConfigService,
              private store: Store<IRootAppState>,
              private toastCtrl: ToastControllerService) {
    try {
      this.availableUnits = [
        this.configService.get().wallet.settings.unitCode.toUpperCase(),
        this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase(),
      ];
    } catch (err) {
      console.log('Error reading the config service.');
      console.log(err);
    }
  }

  async init() {
    try {
      const wallets = await getLatestDefinedValue(this.wallets$);
      this.hasUnlockedWallet = wallets.length > 0;
      this.selectWallet(wallets[0]);
    } catch (err) {
      if (err.text)
        console.log('Could not initialize: ', err.text);
    }
  }

  onCopy() {
    this.toastCtrl.success('Copied to clipboard!');
  }

  selectCurrency($event) {
    this.selectedCurrency = $event;
    this.amountInFiat = `${$event.symbol} ${this.amount * $event.value}`;
  }

  async selectWallet(wallet: DisplayWallet) {
    if (!wallet) return;

    this.selectedWallet = wallet;
    this.changeAmount();
    this.address = this.selectedWallet.client.getRootAddress().toString();
    let info = await getAddressInfo(this.address);
    this.alias = info.alias;
    this.formatAddress();
  }

  changeAmount() {
    let currency = this.selectedCurrency;

    this.amountMicros = mrtToMicro(this.amount);
    this.amountInFiat = `${currency.symbol} ${this.amount * currency.value}`;
    this.formatAddress();
  }

  private formatAddress() {
    this.qrAddress = `${ this.protocolHandler }:${ this.address }${ this.amountMicros ? '?micros=' + this.amountMicros : '' }`;
  }
}
