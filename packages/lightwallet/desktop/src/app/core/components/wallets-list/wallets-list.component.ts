import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';

@Component({
  selector: 'wallets-list',
  templateUrl: './wallets-list.component.html',
  styleUrls: ['./wallets-list.component.sass']
})
export class WalletsListComponent {
  @Input() showButton: boolean = true;
  @Input() wallets: DisplayWallet[];
  @Input() loading: boolean;

  trackByFn(wallet: DisplayWallet) {
    return wallet.id;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastCtrl: ToastControllerService
            ) {}

  shareLink(wallet: DisplayWallet) {
    const code = wallet.alias || wallet.referrerAddress;

    return `${window.location.origin}?invite=${code}`;
  }

  onCopy($event: MouseEvent, walletId: number) {
    $event.stopPropagation();
    this.toastCtrl.success('Share link copied to clipboard!');
  }
}
