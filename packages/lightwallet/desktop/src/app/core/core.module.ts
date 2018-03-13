import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { SharedComponentsModule } from '@merit/desktop/app/components/shared-components.module';
import { CoreRoutingModule } from './core-routing.module';
import { WalletsView } from './wallets/wallets.view';
import { HistoryView } from './history/history.view';
import { ReceiveView } from './receive/receive.view';
import { SendView } from './send/send.view';
import { CoreView } from './core.component';
import { DashboardView } from './dashboard/dashboard.view';
import { CommunityView } from './community/community.view';
import { CreateWalletView } from './wallets/create-wallet/create-wallet.view';
import { WalletDetailView } from './wallets/wallet-details/wallet-details.view';
import { WalletSettingsView } from './wallets/wallet-details/wallet-settings/wallet-settings.view';
import { BackupView } from './backup/backup.view';
import { MnemonicPhraseView } from './backup/mnemonic-phrase/mnemonic-phrase.view';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WalletDetailHistoryView } from './wallets/wallet-details/wallet-details-history/wallet-details-history.view';
import { QRCodeModule } from 'angular2-qrcode';
import { GlobalSettingsView } from './global-settings/global-settings.view';
import { SettingsPreferencesView } from './global-settings/settings-preferences/settings-preferences.view';
import { SettingsTermsOfUseView } from './global-settings/settings-terms-of-use/settings-terms-of-use.view';
import { SettingsSessionLogView } from './global-settings/settings-session-log/settings-session-log.view';
import { CoreComponentsModule } from '@merit/desktop/app/core/components/core-components.module';
import { ImportWalletView } from '@merit/desktop/app/core/wallets/import-wallet/import-wallet.view';
import { ImportByQrView } from '@merit/desktop/app/core/wallets/import-wallet/import-by-qr/import-by-qr.view';
import { ImportWithFileView } from '@merit/desktop/app/core/wallets/import-wallet/import-with-file/import-with-file.view';
import { PhraseImportView } from '@merit/desktop/app/core/wallets/import-wallet/phrase-import/phrase-import.view';

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
    PhraseImportView
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
    ReactiveFormsModule,
    CommonPipesModule,
    SharedComponentsModule,
    CoreComponentsModule,
    FormsModule
  ],
  declarations: [
    CoreView,
    ...getPages()
  ]
})
export class CoreModule {
}
