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
import { WalletDetailComponent } from '@merit/desktop/app/core/wallets/wallet-details/wallet-details.component';
import { WalletDetailHistoryComponent } from '@merit/desktop/app/core/wallets/wallet-details/wallet-details-history/wallet-details-history.component';
import { GlobalSettingsComponent } from '@merit/desktop/app/core/global-settings/global-settings.component';
import { SettingsPreferencesComponent } from '@merit/desktop/app/core/global-settings/settings-preferences/settings-preferences.component';
import { SettingsTermsOfUsComponent } from '@merit/desktop/app/core/global-settings/settings-terms-of-use/settings-terms-of-use.component'
import { SettingsSessionLogComponent } from '@merit/desktop/app/core/global-settings/settings-session-log/settings-session-log.component'
import { WalletSettingsComponent } from '@merit/desktop/app/core/wallets/wallet-details/wallet-settings/wallet-settings.component';


const routes: Routes = [
  {
    path: '', component: CoreComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'wallets', component: WalletsViewComponent, pathMatch: 'full' },
      { path: 'wallets/create', component: CreateWalletComponent },
      { path: 'wallets/:id', component: WalletDetailComponent, children: [
        { path: '', component: WalletDetailHistoryComponent },
        { path: 'history', component: WalletDetailHistoryComponent },
        { path: 'settings', component: WalletSettingsComponent },
        { path: 'send', component: SendComponent },
        { path: 'receive', component: ReceiveComponent }
      ]},
      { path: 'receive', component: ReceiveComponent },
      { path: 'send', component: SendComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'community', component: CommunityComponent },
      { path: 'network', component: NetworkComponent },
      { path: 'backup', component: BackupComponent },
      { path: 'backup/mnemonic-phrase', component: MnemonicPhraseComponent },
      { path: 'settings', component: GlobalSettingsComponent, children: [
        { path: '', component: SettingsPreferencesComponent },
        { path: 'terms-of-use', component: SettingsTermsOfUsComponent },
        { path: 'session-log', component: SettingsSessionLogComponent }
      ]},
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
