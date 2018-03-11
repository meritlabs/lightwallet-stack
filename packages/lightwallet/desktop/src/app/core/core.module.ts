import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { ComponentsModule } from '@merit/desktop/app/components/components.module';
import { CoreRoutingModule } from './core-routing.module';
import { WalletsViewComponent } from './wallets/wallets.view';
import { HistoryComponent } from './history/history.component';
import { ReceiveComponent } from './receive/receive.component';
import { SendComponent } from './send/send.component';
import { CoreComponent } from './core.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CommunityComponent } from './community/community.component';
import { SelectComponent } from './iu/select/select.component';
import { RowItemComponent } from './history/row-item/row-item.component';
import { CreateWalletComponent } from './wallets/create-wallet/create-wallet.component';
import { WalletDetailComponent } from './wallets/wallet-details/wallet-details.component';
import { WalletSettingsComponent } from './wallets/wallet-details/wallet-settings/wallet-settings.component';
import { NetworkComponent } from './network/network.component';
import { ProfileStatsComponent } from './profile-stats/profile-stats.component';
import { BackupComponent } from './backup/backup.component';
import { MnemonicPhraseComponent } from './backup/mnemonic-phrase/mnemonic-phrase.component';
import { WalletsListComponent } from './wallets/wallets/wallets.component';
import { VaultsListComponent } from './wallets/vaults/vaults.component';
import { HistoryListComponent } from './history/history-list/history-list.component';
import { NotificationsComponent } from './iu/notifications/notifications.component';
import { ToastNotificationComponent } from './iu/notifications/toast-notification/toast-notification.component';
import { NotificationsHistoryComponent } from './iu/notifications/notifications-history/notifications-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WalletDetailHistoryComponent } from './wallets/wallet-details/wallet-details-history/wallet-details-history.component';
import { QRCodeModule } from 'angular2-qrcode';
import { GlobalSettingsComponent } from './global-settings/global-settings.component';
import { SettingsPreferencesComponent } from './global-settings/settings-preferences/settings-preferences.component';
import { SettingsTermsOfUsComponent } from './global-settings/settings-terms-of-use/settings-terms-of-use.component';
import { SettingsSessionLogComponent } from './global-settings/settings-session-log/settings-session-log.component';


export function getPages() {
  return [
    WalletsViewComponent,
    HistoryComponent,
    ReceiveComponent,
    SendComponent,
    DashboardComponent,
    CommunityComponent,
    CreateWalletComponent,
    WalletDetailComponent,
    WalletSettingsComponent,
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
    ComponentsModule,
    FormsModule
  ],
  declarations: [
    CoreComponent,
    ...getPages(),
    ToolbarComponent,
    NotificationsComponent,
    SelectComponent,
    RowItemComponent,
    NetworkComponent,
    ProfileStatsComponent,
    BackupComponent,
    MnemonicPhraseComponent,
    WalletsListComponent,
    VaultsListComponent,
    HistoryListComponent,
    ToastNotificationComponent,
    NotificationsHistoryComponent,
    WalletDetailHistoryComponent,
    GlobalSettingsComponent,
    SettingsPreferencesComponent,
    SettingsTermsOfUsComponent,
    SettingsSessionLogComponent,
  ]
})
export class CoreModule {
}
