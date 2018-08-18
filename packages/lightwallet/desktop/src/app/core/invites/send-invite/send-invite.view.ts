import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IRootAppState } from '@merit/common/reducers';
import { AlertService } from '@merit/common/services/alert.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/toPromise';
import { SendInviteFormController } from '@merit/common/controllers/send-invite-form.controller';
import { LoadingControllerService } from '@merit/common/services/loading-controller.service';

@Component({
  selector: 'view-send-invite',
  templateUrl: './send-invite.view.html',
  styleUrls: ['./send-invite.view.sass'],
})
export class SendInviteView {
  formCtrl: SendInviteFormController;

  get address() {
    return this.formCtrl.address;
  }

  get type() {
    return this.formCtrl.type;
  }

  get destination() {
    return this.formCtrl.destination;
  }

  get amount() {
    return this.formCtrl.amount;
  }


  get password() {
    return this.formCtrl.password;
  }

  get confirmPassword() {
    return this.formCtrl.confirmPassword;
  }

  constructor(store: Store<IRootAppState>,
              formBuilder: FormBuilder,
              walletService: WalletService,
              toastCtrl: ToastControllerService,
              logger: LoggerService,
              alertCtrl: AlertService,
              loadingCtrl: LoadingControllerService) {
    this.formCtrl = new SendInviteFormController(store, formBuilder, walletService, logger, toastCtrl, loadingCtrl, alertCtrl);
  }

  async ngOnInit() {
    await this.formCtrl.init();
  }
}
