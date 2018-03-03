import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WalletService } from '@merit/common/services/wallet.service';

@Component({
  selector: 'view-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class WalletsComponent implements OnInit {
  constructor(private walletService: WalletService) {
  }

  ngOnInit() {
  }
}
