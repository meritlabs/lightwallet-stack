import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage({
  segment: 'vault/:vaultId/spend',
  defaultHistory: ['VaultDetailsView']
})
@Component({
  selector: 'vault-spend-view',
  templateUrl: 'vault-spend.html',
})
export class VaultSpendView {
}
