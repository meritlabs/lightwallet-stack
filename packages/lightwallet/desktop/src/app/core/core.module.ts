import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
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
import { contactsReducer } from '../../reducers/contacts';
import { walletsReducer } from '../../reducers/wallets';
import { CommonProvidersModule } from '../../../../common/common-providers.module';
import { SelectComponent } from './iu/select/select.component';
import { RowItemComponent } from './history/row-item/row-item.component';
import { NetworkComponent } from './network/network.component';
import { ProfileStatsComponent } from './profile-stats/profile-stats.component';

export function getPages() {
  return [
    WalletsComponent, HistoryComponent, ReceiveComponent, SendComponent, DashboardComponent, CommunityComponent
  ];
}

export const reducers = {
  contacts: contactsReducer,
  wallets: walletsReducer
};

@NgModule({
  entryComponents: [
    CoreComponent,
    ...getPages()
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    StoreModule.forRoot(reducers),
    CommonProvidersModule.forRoot()
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
  ]
})
export class CoreModule { }
