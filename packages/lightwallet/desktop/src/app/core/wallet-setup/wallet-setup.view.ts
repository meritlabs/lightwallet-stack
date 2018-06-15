import { Component } from '@angular/core';
import { PersistenceService } from '@merit/common/services/persistence.service';

@Component({
  selector: 'app-wallet-setup',
  templateUrl: './wallet-setup.view.html',
  styleUrls: ['./wallet-setup.view.sass'],
})
export class WalletSetupView {
  constructor(private persistenceService: PersistenceService) {}
}
