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
  wallets$: Observable<Array<DisplayWallet>> = this.store.select(getWallets);
  walletsLoading$: Observable<boolean> = this.store.select(getWalletsLoading);


  constructor(
    private store: Store<IAppState>,
  ) { 
    
  }

  ngOnInit() {
  }

}
