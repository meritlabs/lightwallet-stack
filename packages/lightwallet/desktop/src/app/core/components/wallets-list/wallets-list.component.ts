import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Router, ActivatedRoute } from '@angular/router';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';

@Component({
  selector: 'wallets-list',
  templateUrl: './wallets-list.component.html',
  styleUrls: ['./wallets-list.component.sass']
})
export class WalletsListComponent {
  @Input() showButton: boolean = true;
  @Input() wallets: DisplayWallet[];
  @Input() loading: boolean;
  @Input() redirect: boolean = false;
  singleWallet$: any = this.persistenceService.getViewSettings('singleWallet');


  trackByFn(wallet: DisplayWallet) {
    return wallet.id;
  }
  constructor(private route: ActivatedRoute,
              private router: Router,
              private persistenceService: PersistenceService2) {}
              
  ngOnInit() {
    let wallet = this.wallets[0],
      redirectStatus = this.redirect || false;
    if(this.wallets.length === 1) {
      this.persistenceService.setViewSettings('singleWallet', true);
    }else {
      this.persistenceService.setViewSettings('singleWallet', false);
    }
    this.singleWallet$.then(res => {
      if(res && redirectStatus) {
        this.router.navigate(['/wallets/', wallet.id]);
      }
    });
  }
}
