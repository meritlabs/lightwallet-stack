import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '@merit/desktop/app/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '@merit/desktop/app/components/error-message/error-message.component';
import { MeritIconComponent } from '@merit/desktop/app/components/merit-icon/merit-icon.component';
import { HistoryItemComponent } from '@merit/desktop/app/components/history-item/history-item.component';
import { HistoryListComponent } from '@merit/desktop/app/components/history-list/history-list.component';
import { ToastNotificationComponent } from '@merit/desktop/app/components/toast-notification/toast-notification.component';

export function getComponents() {
  return [
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    MeritIconComponent,
    HistoryItemComponent,
    HistoryListComponent,
    ToastNotificationComponent
  ];
}

@NgModule({
  imports: [CommonModule],
  declarations: getComponents(),
  exports: getComponents()
})
export class ComponentsModule { }
