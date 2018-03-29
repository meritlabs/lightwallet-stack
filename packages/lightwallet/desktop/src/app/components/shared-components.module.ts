import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorMessageComponent } from '@merit/desktop/app/components/error-message/error-message.component';
import { LoadingSpinnerSmallComponent } from '@merit/desktop/app/components/loading-spinner-small/loading-spinner-small.component';
import { LoadingSpinnerComponent } from '@merit/desktop/app/components/loading-spinner/loading-spinner.component';
import { LockScreenComponent } from '@merit/desktop/app/components/lock-screen/lock-screen.component';
import { MeritIconComponent } from '@merit/desktop/app/components/merit-icon/merit-icon.component';
import { ToastNotificationComponent } from '@merit/desktop/app/components/toast-notification/toast-notification.component';
import { WalletIconComponent } from '@merit/desktop/app/components/wallet-icon/wallet-icon.component';

export function getComponents() {
  return [
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    MeritIconComponent,
    ToastNotificationComponent,
    LoadingSpinnerSmallComponent,
    LockScreenComponent,
    WalletIconComponent
  ];
}

@NgModule({
  imports: [CommonModule],
  declarations: getComponents(),
  exports: getComponents()
})
export class SharedComponentsModule {}
