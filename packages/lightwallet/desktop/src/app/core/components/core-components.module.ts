import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { SharedComponentsModule } from '@merit/desktop/app/components/shared-components.module';
import { FeeSelectorComponent } from '@merit/desktop/app/core/components/fee-selector/fee-selector.component';
import { NotificationsHistoryComponent } from '@merit/desktop/app/core/components/notifications-history/notifications-history.component';
import { NotificationsComponent } from '@merit/desktop/app/core/components/notifications/notifications.component';
import { ProfileStatsComponent } from '@merit/desktop/app/core/components/profile-stats/profile-stats.component';
import { SelectComponent } from '@merit/desktop/app/core/components/select/select.component';
import { SendMethodComponent } from '@merit/desktop/app/core/components/send-method/send-method.component';
import { ToolbarComponent } from '@merit/desktop/app/core/components/toolbar/toolbar.component';
import { VaultsListComponent } from '@merit/desktop/app/core/components/vaults-list/vaults-list.component';
import { WalletsListComponent } from '@merit/desktop/app/core/components/wallets-list/wallets-list.component';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { MomentModule } from 'ngx-moment';
import { ClipModule } from 'ng2-clip';
import { HistoryItemComponent } from './history-item/history-item.component';
import { HistoryListComponent } from './history-list/history-list.component';
import { GetStartedTipsComponent } from './get-started-tips/get-started-tips.component';

export function getComponents() {
  return [
    HistoryItemComponent,
    HistoryListComponent,
    NotificationsComponent,
    NotificationsHistoryComponent,
    SelectComponent,
    ToolbarComponent,
    WalletsListComponent,
    VaultsListComponent,
    ProfileStatsComponent,
    FeeSelectorComponent,
    SendMethodComponent,
    GetStartedTipsComponent,
  ];
}

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    RouterModule,
    MomentModule,
    CommonPipesModule,
    VirtualScrollModule,
    ClipModule,
  ],
  declarations: getComponents(),
  exports: getComponents()
})
export class CoreComponentsModule {}
