import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackdropComponent } from '@merit/desktop/app/components/backdrop/backdrop.component';
import { ConfirmDialogControllerService } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog-controller.service';
import { ConfirmDialogComponent } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog.component';
import { ErrorMessageComponent } from '@merit/desktop/app/components/error-message/error-message.component';
import { LoadingSpinnerSmallComponent } from '@merit/desktop/app/components/loading-spinner-small/loading-spinner-small.component';
import { LoadingSpinnerComponent } from '@merit/desktop/app/components/loading-spinner/loading-spinner.component';
import { LockScreenComponent } from '@merit/desktop/app/components/lock-screen/lock-screen.component';
import { MeritIconComponent } from '@merit/desktop/app/components/merit-icon/merit-icon.component';
import { PasswordPromptComponent } from '@merit/desktop/app/components/password-prompt/password-prompt.component';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { ToastNotificationComponent } from '@merit/desktop/app/components/toast-notification/toast-notification.component';
import { WalletIconComponent } from '@merit/desktop/app/components/wallet-icon/wallet-icon.component';
import { IllustationsWorryFreeComponent } from '@merit/desktop/app/components/illustations/worry-free/worry-free.component';

export function getComponents() {
  return [
    LoadingSpinnerComponent,
    LoadingSpinnerSmallComponent,
    ErrorMessageComponent,
    MeritIconComponent,
    ToastNotificationComponent,
    LockScreenComponent,
    WalletIconComponent,
    PasswordPromptComponent,
    BackdropComponent,
    ConfirmDialogComponent,
    IllustationsWorryFreeComponent
  ];
}

@NgModule({
  entryComponents: [
    ToastNotificationComponent,
    PasswordPromptComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: getComponents(),
  exports: getComponents()
})
export class SharedComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedComponentsModule,
      providers: [
        ToastControllerService,
        PasswordPromptController,
        ConfirmDialogControllerService
      ]
    };
  }
}
