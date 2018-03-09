import { Component, OnInit } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {getWallets, getWalletsLoading} from "@merit/common/reducers/wallets.reducer";
import {IRootAppState} from "@merit/common/reducers";

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.sass']
})
export class NetworkComponent {
  wallets$: Observable<Array<DisplayWallet>> = this.store.select(getWallets);
  walletsLoading$: Observable<boolean> = this.store.select(getWalletsLoading);


  constructor(
    private store: Store<IRootAppState>,
  ) {}

}
