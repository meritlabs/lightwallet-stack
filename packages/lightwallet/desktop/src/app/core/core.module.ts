import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonDirectivesModule } from '@merit/common/common-directives.module';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { SharedComponentsModule } from '@merit/desktop/app/components/shared-components.module';
import { FileBackupView } from '@merit/desktop/app/core/backup/file-backup/file-backup.view';
import { CoreComponentsModule } from '@merit/desktop/app/core/components/core-components.module';
import { InviteRequestsView } from '@merit/desktop/app/core/invites/invite-requests/invite-requests.view';
import { InvitesHistoryView } from '@merit/desktop/app/core/invites/invites-history/invites-history.view';
import { InvitesView } from '@merit/desktop/app/core/invites/invites.view';
import { SendInviteView } from '@merit/desktop/app/core/invites/send-invite/send-invite.view';
import { WalletPasswordGuard } from '@merit/desktop/app/guards/wallet-password.guard';
import { QRCodeModule } from 'angular2-qrcode';
import { ClipModule } from 'ng2-clip';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { MomentModule } from 'ngx-moment';
import { BackupView } from './backup/backup.view';
import { MnemonicPhraseView } from './backup/mnemonic-phrase/mnemonic-phrase.view';
import { QrCodeBackupView } from './backup/qr-code-backup/qr-code-backup.view';
import { CommunityView } from './community/community.view';
import { InvitesWidgetComponent } from './invites/invites-widget/invites-widget.component';
import { CoreRoutingModule } from './core-routing.module';
import { CoreView } from './core.component';
import { DashboardView } from './dashboard/dashboard.view';
import { GlobalSettingsView } from './global-settings/global-settings.view';
import { SettingsPreferencesView } from './global-settings/settings-preferences/settings-preferences.view';
import { SettingsSessionLogView } from './global-settings/settings-session-log/settings-session-log.view';
import { SettingsTermsOfUseView } from './global-settings/settings-terms-of-use/settings-terms-of-use.view';
import { HistoryView } from './history/history.view';
import { ReceiveView } from './receive/receive.view';
import { SendTourComponent } from './send/send-tour/send-tour.component';
import { SendView } from './send/send.view';
import { CreateWalletView } from './wallets/create-wallet/create-wallet.view';
import { WalletDetailHistoryView } from './wallets/wallet-details/wallet-details-history/wallet-details-history.view';
import { WalletDetailView } from './wallets/wallet-details/wallet-details.view';
import { WalletSettingsView } from './wallets/wallet-details/wallet-settings/wallet-settings.view';
import { WalletsView } from './wallets/wallets.view';
import { WalletSetupView } from './wallet-setup/wallet-setup.view';
import { TaskPreviewComponent } from './wallet-setup/task-preview/task-preview.component';
import { WalletSetupListView } from './wallet-setup/wallet-setup-list/wallet-setup-list.view';
import { RecordPassphraseComponent } from './dialog/record-passphrase/record-passphrase.component';
import { WelcomeToSetupTrackerComponent } from './dialog/welcome-to-setup-tracker/welcome-to-setup-tracker.component';
import { PendingInviteItemComponent } from './invites/pending-invite-item/pending-invite-item.component';
import { BackupNewWallet } from '@merit/desktop/app/core/dialog/backup-new-wallet/backup-new-wallet.component';

export function getPages() {
  return [
    WalletsView,
    HistoryView,
    ReceiveView,
    SendView,
    DashboardView,
    CreateWalletView,
    WalletDetailView,
    WalletSettingsView,
    CommunityView,
    BackupView,
    MnemonicPhraseView,
    WalletDetailHistoryView,
    GlobalSettingsView,
    SettingsPreferencesView,
    SettingsTermsOfUseView,
    SettingsSessionLogView,
    QrCodeBackupView,
    FileBackupView,
    InvitesWidgetComponent,
    InvitesView,
    InvitesHistoryView,
    SendInviteView,
    InviteRequestsView,
    SendInviteView,
    WalletSetupView,
    WalletSetupListView,
    BackupNewWallet
  ];
}

@NgModule({
  entryComponents: [CoreView, ...getPages()],
  imports: [
    CommonModule,
    CoreRoutingModule,
    ReactiveFormsModule,
    QRCodeModule,
    CommonPipesModule,
    SharedComponentsModule,
    FormsModule,
    MomentModule,
    ClipModule,
    Ng4LoadingSpinnerModule,
    CoreComponentsModule,
    CommonDirectivesModule,
  ],
  declarations: [
    CoreView,
    ...getPages(),
    SendTourComponent,
    RecordPassphraseComponent,
    TaskPreviewComponent,
    WelcomeToSetupTrackerComponent,
    PendingInviteItemComponent,
  ],
  providers: [WalletPasswordGuard],
})
export class CoreModule {}
