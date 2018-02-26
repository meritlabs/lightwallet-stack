import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { CoreRoutingModule } from './core-routing.module';
import { WalletsComponent } from './wallets/wallets.component';
import { HistoryComponent } from './history/history.component';
import { ReceiveComponent } from './receive/receive.component';
import { SendComponent } from './send/send.component';
import { CoreComponent } from './core.component';
import { MatButtonModule, MatMenuModule } from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CommunityComponent } from './community/community.component';
import { NotificationsComponent } from './toolbar/notifications/notifications.component';
import { contactsReducer } from '../../reducers/contacts';
import { walletsReducer } from '../../reducers/wallets';
import { CommonProvidersModule } from '../../../../common/common-providers.module';

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
    MatButtonModule,
    MatMenuModule,
    CommonProvidersModule.forRoot()
  ],
  declarations: [
    CoreComponent,
    ...getPages(),
    ToolbarComponent,
    NotificationsComponent,
  ]
})
export class CoreModule { }
