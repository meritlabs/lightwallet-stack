import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { SharedComponentsModule } from '@merit/desktop/app/components/shared-components.module';
import { NotificationsHistoryComponent } from '@merit/desktop/app/core/components/notifications-history/notifications-history.component';
import { NotificationsComponent } from '@merit/desktop/app/core/components/notifications/notifications.component';
import { ProfileStatsComponent } from '@merit/desktop/app/core/components/profile-stats/profile-stats.component';
import { SelectComponent } from '@merit/desktop/app/core/components/select/select.component';
import { ToolbarComponent } from '@merit/desktop/app/core/components/toolbar/toolbar.component';
import { VaultsListComponent } from '@merit/desktop/app/core/components/vaults-list/vaults-list.component';
import { WalletsListComponent } from '@merit/desktop/app/core/components/wallets-list/wallets-list.component';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { MomentModule } from 'ngx-moment';
import { HistoryItemComponent } from './history-item/history-item.component';
import { HistoryListComponent } from './history-list/history-list.component';

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
    ProfileStatsComponent
  ];
}

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    RouterModule,
    MomentModule,
    CommonPipesModule,
    VirtualScrollModule
  ],
  declarations: getComponents(),
  exports: getComponents()
})
export class CoreComponentsModule {}
