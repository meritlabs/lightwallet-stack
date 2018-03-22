import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '@merit/desktop/app/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '@merit/desktop/app/components/error-message/error-message.component';
import { MeritIconComponent } from '@merit/desktop/app/components/merit-icon/merit-icon.component';
import { ToastNotificationComponent } from '@merit/desktop/app/components/toast-notification/toast-notification.component';
import { LockScreenComponent } from '@merit/desktop/app/components/lock-screen/lock-screen.component';

export function getComponents() {
  return [
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    MeritIconComponent,
    ToastNotificationComponent,
    LockScreenComponent
  ];
}

@NgModule({
  imports: [CommonModule],
  declarations: getComponents(),
  exports: getComponents()
})
export class SharedComponentsModule { }
