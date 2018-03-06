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
import { NotificationsComponent } from './toolbar/notifications/notifications.component';
import { SelectComponent } from './iu/select/select.component';
import { RowItemComponent } from './history/row-item/row-item.component';
import { CommonProvidersModule } from '@merit/common/common-providers.module';
import { CreateWalletComponent } from './wallets/create-wallet/create-wallet.component';
import { WalletDetailComponent } from './wallets/wallet-detail/wallet-detail.component';
import { WalletSettingsComponent } from './wallets/wallet-settings/wallet-settings.component';

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
  ]
})
export class CoreModule {
}
