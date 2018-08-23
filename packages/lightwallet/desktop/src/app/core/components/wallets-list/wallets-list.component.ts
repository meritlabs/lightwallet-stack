import { Component, Input } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'wallets-list',
  templateUrl: './wallets-list.component.html',
  styleUrls: ['./wallets-list.component.sass'],
})
export class WalletsListComponent {
  @Input() wallets: DisplayWallet[];
  @Input() loading: boolean;
  @Input() limit: number

  trackByFn(wallet: DisplayWallet) {
    return wallet.id;
  }

  ngOnInit() {
    console.log(this.limit);
    console.log(this.wallets);
    
    
    // if(this.limit > 0) {
    //   this.wallets.length = this.limit;
    // }
  }
}
