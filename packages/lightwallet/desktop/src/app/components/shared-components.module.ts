import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastControllerService as ToastControllerServiceBase } from '@merit/common/services/toast-controller.service';
import { BackdropComponent } from '@merit/desktop/app/components/backdrop/backdrop.component';
import { ConfirmDialogControllerService } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog-controller.service';
import { ConfirmDialogComponent } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog.component';
import { GlobalsendLinkPopupComponent } from '@merit/desktop/app/components/meritmoney-link-popup/meritmoney-link-popup.component';
import { GlobalsendLinkPopupController } from '@merit/desktop/app/components/meritmoney-link-popup/meritmoney-link-popup.controller';
import { IllustationsSendingMeritComponent } from '@merit/desktop/app/components/illustations/sending-merit/sending-merit.component';
import { IllustationsThatsItComponent } from '@merit/desktop/app/components/illustations/thats-it/thats-it.component';
import { IllustationsWorryFreeComponent } from '@merit/desktop/app/components/illustations/worry-free/worry-free.component';
import { IllustationsYourWayComponent } from '@merit/desktop/app/components/illustations/your-way/your-way.component';
import { LoadingSpinnerSmallComponent } from '@merit/desktop/app/components/loading-spinner-small/loading-spinner-small.component';
import { LoadingSpinnerComponent } from '@merit/desktop/app/components/loading-spinner/loading-spinner.component';
import { LockScreenComponent } from '@merit/desktop/app/components/lock-screen/lock-screen.component';
import { MeritIconComponent } from '@merit/desktop/app/components/merit-icon/merit-icon.component';
import { MessageBoxComponent } from '@merit/desktop/app/components/message-box/message-box.component';
import { PasswordPromptComponent } from '@merit/desktop/app/components/password-prompt/password-prompt.component';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { ToastNotificationComponent } from '@merit/desktop/app/components/toast-notification/toast-notification.component';
import { UICheckboxComponent } from '@merit/desktop/app/components/ui-checkbox/ui-checkbox.component';
import { WalletIconComponent } from '@merit/desktop/app/components/wallet-icon/wallet-icon.component';
import { ClipModule } from 'ng2-clip';

export function getComponents() {
  return [
    LoadingSpinnerComponent,
    LoadingSpinnerSmallComponent,
    MessageBoxComponent,
    MeritIconComponent,
    ToastNotificationComponent,
    LockScreenComponent,
    WalletIconComponent,
    PasswordPromptComponent,
    BackdropComponent,
    ConfirmDialogComponent,
    IllustationsWorryFreeComponent,
    IllustationsSendingMeritComponent,
    IllustationsThatsItComponent,
    IllustationsYourWayComponent,
    GlobalsendLinkPopupComponent,
    UICheckboxComponent
  ];
}

@NgModule({
  entryComponents: [
    ToastNotificationComponent,
    PasswordPromptComponent,
    ConfirmDialogComponent,
    GlobalsendLinkPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClipModule
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
        { provide: ToastControllerServiceBase, useClass: ToastControllerService },
        PasswordPromptController,
        ConfirmDialogControllerService,
        GlobalsendLinkPopupController
      ]
    };
  }
}
