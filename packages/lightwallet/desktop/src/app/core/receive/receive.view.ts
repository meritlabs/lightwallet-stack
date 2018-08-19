import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { ConfigService } from '@merit/common/services/config.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { ReceiveViewController } from '@merit/common/controllers/receive-view.controller';

@Component({
  selector: 'view-receive',
  templateUrl: './receive.view.html',
  styleUrls: ['./receive.view.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class ReceiveView implements OnInit {
  ctrl: ReceiveViewController;

  constructor(configService: ConfigService,
              store: Store<IRootAppState>,
              toastCtrl: ToastControllerService) {
    this.ctrl = new ReceiveViewController(configService, store, toastCtrl);
  }

  async ngOnInit() {
    await this.ctrl.init();
  }
}
