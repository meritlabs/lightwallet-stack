import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletPasswordGuard } from '@merit/desktop/app/guards/wallet-password.guard';
import { WalletsView } from './wallets/wallets.view';
import { ReceiveView } from './receive/receive.view';
import { SendView } from './send/send.view';
import { HistoryView } from './history/history.view';
import { CoreView } from './core.component';
import { DashboardView } from './dashboard/dashboard.view';
import { CommunityView } from './community/community.view';
import { BackupView } from './backup/backup.view';
import { MnemonicPhraseView } from './backup/mnemonic-phrase/mnemonic-phrase.view';
import { CreateWalletView } from '@merit/desktop/app/core/wallets/create-wallet/create-wallet.view';
import { WalletDetailView } from '@merit/desktop/app/core/wallets/wallet-details/wallet-details.view';
import { WalletDetailHistoryView } from '@merit/desktop/app/core/wallets/wallet-details/wallet-details-history/wallet-details-history.view';
import { GlobalSettingsView } from '@merit/desktop/app/core/global-settings/global-settings.view';
import { SettingsPreferencesView } from '@merit/desktop/app/core/global-settings/settings-preferences/settings-preferences.view';
import { SettingsTermsOfUseView } from '@merit/desktop/app/core/global-settings/settings-terms-of-use/settings-terms-of-use.view';
import { SettingsSessionLogView } from '@merit/desktop/app/core/global-settings/settings-session-log/settings-session-log.view';
import { WalletSettingsView } from '@merit/desktop/app/core/wallets/wallet-details/wallet-settings/wallet-settings.view';
import { ImportWalletView } from '@merit/desktop/app/core/wallets/import-wallet/import-wallet.view';
import { ImportByQrView } from '@merit/desktop/app/core/wallets/import-wallet/import-by-qr/import-by-qr.view';
import { ImportWithFileView } from '@merit/desktop/app/core/wallets/import-wallet/import-with-file/import-with-file.view';
import { PhraseImportView } from '@merit/desktop/app/core/wallets/import-wallet/phrase-import/phrase-import.view';
import { RequestsComponent } from '@merit/desktop/app/core/community/invites/requests/requests.component';
import { SendInviteComponent } from '@merit/desktop/app/core/community/invites/send-invite/send-invite.component';
import { QrCodeBackupView } from '@merit/desktop/app/core/backup/qr-code-backup/qr-code-backup.view';
import { FileBackupView } from '@merit/desktop/app/core/backup/file-backup/file-backup.view';

const routes: Routes = [
  {
    path: '', component: CoreView,
    children: [
      { path: 'dashboard', component: DashboardView },
      { path: 'wallets', component: WalletsView, pathMatch: 'full' },
      { path: 'wallets/create', component: CreateWalletView },
      { path: 'wallets/import', component: ImportWalletView },
      { path: 'wallets/import/qr-code', component: ImportByQrView },
      { path: 'wallets/import/file', component: ImportWithFileView },
      { path: 'wallets/import/phrase', component: PhraseImportView },
      {
        path: 'wallets/:id', component: WalletDetailView, children: [
          { path: '', component: WalletDetailHistoryView },
          { path: 'history', component: WalletDetailHistoryView },
          { path: 'settings', component: WalletSettingsView },
          { path: 'send', component: SendView },
          { path: 'receive', component: ReceiveView },
          { path: 'export', component: BackupView, pathMatch: 'full', canActivate: [WalletPasswordGuard] },
          { path: 'export/mnemonic', component: MnemonicPhraseView, canActivate: [WalletPasswordGuard] },
          { path: 'export/qr-code', component: QrCodeBackupView, canActivate: [WalletPasswordGuard] },
          { path: 'export/file', component: FileBackupView, canActivate: [WalletPasswordGuard] }
        ]
      },
      { path: 'receive', component: ReceiveView },
      { path: 'send', component: SendView },
      { path: 'history', component: HistoryView },
      { path: 'community', component: CommunityView },
      { path: 'community/invite-requests', component: RequestsComponent },
      { path: 'community/send-invite', component: SendInviteComponent },
      {
        path: 'settings', component: GlobalSettingsView, children: [
          { path: '', component: SettingsPreferencesView },
          { path: 'terms-of-use', component: SettingsTermsOfUseView },
          { path: 'session-log', component: SettingsSessionLogView }
        ]
      },
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
