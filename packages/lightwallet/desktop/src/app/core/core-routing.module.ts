import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletsViewComponent } from './wallets/wallets.view';
import { ReceiveComponent } from './receive/receive.component';
import { SendComponent } from './send/send.component';
import { HistoryComponent } from './history/history.component';
import { CoreComponent } from './core.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommunityComponent } from './community/community.component';
import { NetworkComponent } from './network/network.component';
import { BackupComponent } from './backup/backup.component';
import { MnemonicPhraseComponent } from './backup/mnemonic-phrase/mnemonic-phrase.component';
import { CreateWalletComponent } from '@merit/desktop/app/core/wallets/create-wallet/create-wallet.component';
import { WalletDetailsView } from '../../../../mobile/src/app/wallets/wallet-details/wallet-details';
import { WalletSettingsComponent } from '@merit/desktop/app/core/wallets/wallet-settings/wallet-settings.component';
import { WalletDetailComponent } from '@merit/desktop/app/core/wallets/wallet-detail/wallet-detail.component';

const routes: Routes = [
  {
    path: '', component: CoreComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'wallets', component: WalletsViewComponent, pathMatch: 'full' },
      { path: 'wallets/create', component: CreateWalletComponent },
      { path: 'wallets/:id', component: WalletDetailComponent },
      { path: 'receive', component: ReceiveComponent },
      { path: 'send', component: SendComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'community', component: CommunityComponent },
      { path: 'network', component: NetworkComponent },
      { path: 'backup', component: BackupComponent },
      { path: 'backup/mnemonic-phrase', component: MnemonicPhraseComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
