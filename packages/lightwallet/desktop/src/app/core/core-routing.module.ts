import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletsView } from './wallets/wallets.view';
import { ReceiveComponent } from './receive/receive.view';
import { SendView } from './send/send.view';
import { HistoryView } from './history/history.view';
import { CoreComponent } from './core.component';
import { DashboardView } from './dashboard/dashboard.view';
import { CommunityComponent } from './community/community.view';
import { CommunityView } from './community/community.view';
import { BackupComponent } from './backup/backup.view';
import { MnemonicPhraseView } from './backup/mnemonic-phrase/mnemonic-phrase.view';
import { CreateWalletView } from '@merit/desktop/app/core/wallets/create-wallet/create-wallet.view';
import { WalletDetailComponent } from '@merit/desktop/app/core/wallets/wallet-details/wallet-details.view';
import { WalletDetailHistoryView } from '@merit/desktop/app/core/wallets/wallet-details/wallet-details-history/wallet-details-history.view';
import { GlobalSettingsView } from '@merit/desktop/app/core/global-settings/global-settings.view';
import { SettingsPreferencesView } from '@merit/desktop/app/core/global-settings/settings-preferences/settings-preferences.view';
import { SettingsTermsOfUseView } from '@merit/desktop/app/core/global-settings/settings-terms-of-use/settings-terms-of-use.view'
import { SettingsSessionLogView } from '@merit/desktop/app/core/global-settings/settings-session-log/settings-session-log.view'
import { WalletSettingsView } from '@merit/desktop/app/core/wallets/wallet-details/wallet-settings/wallet-settings.view';


const routes: Routes = [
  {
    path: '', component: CoreComponent,
    children: [
      { path: 'dashboard', component: DashboardView },
      { path: 'wallets', component: WalletsView, pathMatch: 'full' },
      { path: 'wallets/create', component: CreateWalletView },
      { path: 'wallets/:id', component: WalletDetailComponent, children: [
        { path: '', component: WalletDetailHistoryView },
        { path: 'history', component: WalletDetailHistoryView },
        { path: 'settings', component: WalletSettingsView },
        { path: 'send', component: SendView },
        { path: 'receive', component: ReceiveComponent }
      ]},
      { path: 'receive', component: ReceiveComponent },
      { path: 'send', component: SendView },
      { path: 'history', component: HistoryView },
      { path: 'community', component: CommunityComponent },
      { path: 'network', component: CommunityView },
      { path: 'backup', component: BackupComponent },
      { path: 'backup/mnemonic-phrase', component: MnemonicPhraseView },
      { path: 'settings', component: GlobalSettingsView, children: [
        { path: '', component: SettingsPreferencesView },
        { path: 'terms-of-use', component: SettingsTermsOfUseView },
        { path: 'session-log', component: SettingsSessionLogView }
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
