import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonDirectivesModule } from '@merit/common/common-directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { SharedComponentsModule } from '@merit/desktop/app/components/shared-components.module';
import { FeeSelectorComponent } from '@merit/desktop/app/core/components/fee-selector/fee-selector.component';
import { NotificationsHistoryComponent } from '@merit/desktop/app/core/components/notifications-history/notifications-history.component';
import { NotificationsComponent } from '@merit/desktop/app/core/components/notifications/notifications.component';
import { ProfileStatsComponent } from '@merit/desktop/app/core/components/profile-stats/profile-stats.component';
import { SelectComponent } from '@merit/desktop/app/core/components/select/select.component';
import { SelectPoolComponent } from '@merit/desktop/app/core/components/select-pool/select-pool.component';
import { AddPoolFormComponent } from '@merit/desktop/app/core/components/add-pool-form/add-pool-form.component';
import { SendMethodComponent } from '@merit/desktop/app/core/components/send-method/send-method.component';
import { ToolbarComponent } from '@merit/desktop/app/core/components/toolbar/toolbar.component';
import { VaultsListComponent } from '@merit/desktop/app/core/components/vaults-list/vaults-list.component';
import { WalletsListComponent } from '@merit/desktop/app/core/components/wallets-list/wallets-list.component';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { ClipModule } from 'ng2-clip';
import { MomentModule } from 'ngx-moment';
import { GetStartedTipsComponent } from './profile-stats/get-started-tips/get-started-tips.component';
import { HistoryItemComponent } from './history-item/history-item.component';
import { HistoryListComponent } from './history-list/history-list.component';
import { ShareBoxComponent } from './share-box/share-box.component';
import { TaskConfirmComponent } from '@merit/desktop/app/core/dialog/task-confirm/task-confirm.component';
import { CommunityRankComponent } from './profile-stats/community-rank/community-rank.component';

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
    ShareBoxComponent,
    TaskConfirmComponent,
    CommunityRankComponent,
    SelectPoolComponent,
    AddPoolFormComponent
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
    CommonDirectivesModule,
    ReactiveFormsModule
  ],
  declarations: getComponents(),
  exports: getComponents(),
})
export class CoreComponentsModule {}
