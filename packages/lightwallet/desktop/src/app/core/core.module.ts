import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { WebPushNotificationsService } from '@merit/common/services/web-push-notifications.service';
import { SharedComponentsModule } from '@merit/desktop/app/components/shared-components.module';
import { FileBackupView } from '@merit/desktop/app/core/backup/file-backup/file-backup.view';
import { CoreComponentsModule } from '@merit/desktop/app/core/components/core-components.module';
import { ImportByQrView } from '@merit/desktop/app/core/wallets/import-wallet/import-by-qr/import-by-qr.view';
import { ImportWalletView } from '@merit/desktop/app/core/wallets/import-wallet/import-wallet.view';
import { ImportWithFileView } from '@merit/desktop/app/core/wallets/import-wallet/import-with-file/import-with-file.view';
import { PhraseImportView } from '@merit/desktop/app/core/wallets/import-wallet/phrase-import/phrase-import.view';
import { MomentModule } from 'angular2-moment';
import { QRCodeModule } from 'angular2-qrcode';
import { BackupView } from './backup/backup.view';
import { MnemonicPhraseView } from './backup/mnemonic-phrase/mnemonic-phrase.view';
import { QrCodeBackupView } from './backup/qr-code-backup/qr-code-backup.view';
import { CommunityView } from './community/community.view';
import { InvitesComponent } from './community/invites/invites.component';
import { RequestsComponent } from './community/invites/requests/requests.component';
import { SendInviteComponent } from './community/invites/send-invite/send-invite.component';
import { CoreRoutingModule } from './core-routing.module';
import { CoreView } from './core.component';
import { DashboardView } from './dashboard/dashboard.view';
import { GlobalSettingsView } from './global-settings/global-settings.view';
import { SettingsPreferencesView } from './global-settings/settings-preferences/settings-preferences.view';
import { SettingsSessionLogView } from './global-settings/settings-session-log/settings-session-log.view';
import { SettingsTermsOfUseView } from './global-settings/settings-terms-of-use/settings-terms-of-use.view';
import { HistoryView } from './history/history.view';
import { ReceiveView } from './receive/receive.view';
import { SendView } from './send/send.view';
import { CreateWalletView } from './wallets/create-wallet/create-wallet.view';
import { WalletDetailHistoryView } from './wallets/wallet-details/wallet-details-history/wallet-details-history.view';
import { WalletDetailView } from './wallets/wallet-details/wallet-details.view';
import { WalletSettingsView } from './wallets/wallet-details/wallet-settings/wallet-settings.view';
import { WalletsView } from './wallets/wallets.view';

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
    ImportWalletView,
    ImportByQrView,
    ImportWithFileView,
    PhraseImportView,
    QrCodeBackupView,
    FileBackupView,
    InvitesComponent,
    RequestsComponent,
    SendInviteComponent
  ];
}

@NgModule({
  entryComponents: [
    CoreView,
    ...getPages()
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    ReactiveFormsModule,
    QRCodeModule,
    CommonPipesModule,
    SharedComponentsModule,
    CoreComponentsModule,
    FormsModule,
    MomentModule
  ],
  declarations: [
    CoreView,
    ...getPages()
  ],
  providers: [
    { provide: PushNotificationsService, useClass: WebPushNotificationsService },
    EmailNotificationsService
  ]
})
export class CoreModule {
}
