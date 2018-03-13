import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryItemComponent } from './history-item/history-item.component';
import { HistoryListComponent } from './history-list/history-list.component';
import { NotificationsComponent } from '@merit/desktop/app/core/components/notifications/notifications.component';
import { NotificationsHistoryComponent } from '@merit/desktop/app/core/components/notifications-history/notifications-history.component';
import { SelectComponent } from '@merit/desktop/app/core/components/select/select.component';
import { ToolbarComponent } from '@merit/desktop/app/core/components/toolbar/toolbar.component';
import { WalletsListComponent } from '@merit/desktop/app/core/components/wallets-list/wallets-list.component';
import { VaultsListComponent } from '@merit/desktop/app/core/components/vaults-list/vaults-list.component';
import { ProfileStatsComponent } from '@merit/desktop/app/core/components/profile-stats/profile-stats.component';

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
  imports: [CommonModule],
  declarations: getComponents(),
  exports: getComponents()
})
export class CoreComponentsModule {}
