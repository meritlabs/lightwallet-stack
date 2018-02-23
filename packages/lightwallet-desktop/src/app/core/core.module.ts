import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { WalletsComponent } from './wallets/wallets.component';
import { HistoryComponent } from './history/history.component';
import { ReceiveComponent } from './receive/receive.component';
import { SendComponent } from './send/send.component';
import { CoreComponent } from './core.component';
import { MatSidenavModule } from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

export function getPages() {
  return [
    WalletsComponent, HistoryComponent, ReceiveComponent, SendComponent, DashboardComponent
  ];
}

@NgModule({
  entryComponents: [
    CoreComponent,
    ...getPages()
  ],
  imports: [
    CommonModule,
    CoreRoutingModule
  ],
  declarations: [
    CoreComponent,
    ...getPages(),
    ToolbarComponent
  ]
})
export class CoreModule { }
