import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { SharedComponentsModule } from '@merit/desktop/app/components/shared-components.module';
import { CoreRoutingModule } from './core-routing.module';
import { WalletsView } from './wallets/wallets.view';
import { HistoryView } from './history/history.view';
import { ReceiveComponent } from './receive/receive.view';
import { SendView } from './send/send.view';
import { CoreComponent } from './core.component';
import { DashboardView } from './dashboard/dashboard.view';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CommunityComponent, CommunityView } from './community/community.view';
import { CreateWalletView } from './wallets/create-wallet/create-wallet.view';
import { WalletDetailComponent } from './wallets/wallet-details/wallet-details.view';
import { WalletSettingsView } from './wallets/wallet-details/wallet-settings/wallet-settings.view';
import { ProfileStatsComponent } from './profile-stats/profile-stats.component';
import { BackupComponent } from './backup/backup.view';
import { MnemonicPhraseView } from './backup/mnemonic-phrase/mnemonic-phrase.view';
import { WalletsListComponent } from './wallets/wallets-list/wallets-list.component';
import { VaultsListComponent } from './wallets/vaults-list/vaults-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WalletDetailHistoryView } from './wallets/wallet-details/wallet-details-history/wallet-details-history.view';
import { QRCodeModule } from 'angular2-qrcode';
import { GlobalSettingsView } from './global-settings/global-settings.view';
import { SettingsPreferencesView } from './global-settings/settings-preferences/settings-preferences.view';
import { SettingsTermsOfUseView } from './global-settings/settings-terms-of-use/settings-terms-of-use.view';
import { SettingsSessionLogView } from './global-settings/settings-session-log/settings-session-log.view';
import { CoreComponentsModule } from '@merit/desktop/app/core/components/core-components.module';


export function getPages() {
  return [
    WalletsView,
    HistoryView,
    ReceiveComponent,
    SendView,
    DashboardView,
    CommunityComponent,
    CreateWalletView,
    WalletDetailComponent,
    WalletSettingsView
  ];
}

@NgModule({
  entryComponents: [
    CoreComponent,
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
    CoreComponent,
    ...getPages(),
    ToolbarComponent,
    CommunityView,
    BackupComponent,
    MnemonicPhraseView,
    WalletDetailHistoryView,
    GlobalSettingsView,
    SettingsPreferencesView,
    SettingsTermsOfUseView,
    SettingsSessionLogView
  ]
})
export class CoreModule {
}
