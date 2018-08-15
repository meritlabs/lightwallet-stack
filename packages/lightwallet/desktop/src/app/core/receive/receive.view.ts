import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { selectConfirmedWallets, selectWalletsLoading } from '@merit/common/reducers/wallets.reducer';
import { AddressService } from '@merit/common/services/address.service';
import { ConfigService } from '@merit/common/services/config.service';
import { RateService } from '@merit/common/services/rate.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { ReceiveViewController } from '@merit/common/controllers/receive-view.controller';

@Component({
  selector: 'view-receive',
  templateUrl: './receive.view.html',
  styleUrls: ['./receive.view.sass'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiveView implements OnInit {
  ctrl: ReceiveViewController;

  constructor(configService: ConfigService,
              store: Store<IRootAppState>,
              toastCtrl: ToastControllerService) {
    this.ctrl = new ReceiveViewController(configService, store, toastCtrl)
  }

  async ngOnInit() {
    await this.ctrl.init();
  }
}
