import { Component, OnInit } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { Store } from '@ngrx/store';
//import { Rx } from 'rxjs/rx';
import { reduce, groupBy } from 'rxjs/operators';
import { getWalletsLoading, getWallets, IAppState } from '@merit/common/reducers';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { FiatAmount } from '@merit/common/models/fiat-amount';
import * as _ from 'lodash';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.sass']
})
export class NetworkComponent implements OnInit {
  wallets$: Observable<Array<DisplayWallet & any>> = this.store.select(getWallets)
  .map((dWallets: DisplayWallet[]) => dWallets.map((dWallet: DisplayWallet) => {
    if (!_.isNil(dWallet.totalNetworkValueMicro)) {
      dWallet.totalNetworkValueMerit = this.txFormatService.parseAmount(dWallet.totalNetworkValueMicro, 'micros').amountUnitStr;
      dWallet.totalNetworkValueFiat = new FiatAmount(+this.txFormatService.formatToUSD(dWallet.totalNetworkValueMicro)).amountStr;
    }

    if (!_.isNil(dWallet.miningRewardsMicro)) {
      dWallet.miningRewardsMerit = this.txFormatService.parseAmount(dWallet.miningRewardsMicro, 'micros').amountUnitStr;
      dWallet.miningRewardsFiat = new FiatAmount(+this.txFormatService.formatToUSD(dWallet.miningRewardsMicro)).amountStr;
    }

    if (!_.isNil(dWallet.ambassadorRewardsMicro)) {
      dWallet.ambassadorRewardsMerit = this.txFormatService.parseAmount(dWallet.ambassadorRewardsMicro, 'micros').amountUnitStr;
      dWallet.ambassadorRewardsFiat = new FiatAmount(+this.txFormatService.formatToUSD(dWallet.ambassadorRewardsMicro)).amountStr;
    }
    return dWallet;
    
  }));
  walletsLoading$: Observable<boolean> = this.store.select(getWalletsLoading);
  communityTotals$: Observable<any>;
  //walletSource = Rx.Observable.from(this.wallets$);

  constructor(
    private store: Store<IAppState>,
    private txFormatService: TxFormatService    
  ) { 
    
    const checking$ = this.wallets$.pipe(
      groupBy(dWallet => (dWallet as any).totalBalanceMicros)
    )
    const subscribe = checking$.subscribe(val => console.log(val));
  }

  ngOnInit() {
  }

}
