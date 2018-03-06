import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { WalletsComponent } from './wallets/wallets.component';
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
import { WalletDetailComponent } from './wallets/wallet-detail/wallet-detail.component';
import { WalletSettingsComponent } from './wallets/wallet-settings/wallet-settings.component';
import { NetworkComponent } from './network/network.component';
import { ProfileStatsComponent } from './profile-stats/profile-stats.component';
import { BackupComponent } from './backup/backup.component';
import { MnemonicPhraseComponent } from './backup/mnemonic-phrase/mnemonic-phrase.component';
import { PersonalComponent } from './wallets/personal/personal.component';
import { VaultsComponent } from './wallets/vaults/vaults.component';
import { HistoryListComponent } from './history/history-list/history-list.component';
import { NotificationsComponent } from './iu/notifications/notifications.component';
import { ToastNotificationComponent } from './iu/notifications/toast-notification/toast-notification.component';
import { NotificationsHistoryComponent } from './iu/notifications/notifications-history/notifications-history.component';
import { CommonProvidersModule } from '@merit/common/common-providers.module';

export function getPages() {
  return [
    WalletsComponent,
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
    CommonProvidersModule.forRoot(),
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
    PersonalComponent,
    VaultsComponent,
    HistoryListComponent,
    ToastNotificationComponent,
    NotificationsHistoryComponent,
  ]
})
export class CoreModule {
}
