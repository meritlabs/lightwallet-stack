import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TouchIdService } from 'merit/shared/touch-id/touch-id.service';

@Component({
  selector: 'page-fingerprint-lock',
  templateUrl: 'fingerprint-lock.html',
})
export class FingerprintLockView {

  constructor(
    private touchid: TouchIdService,
    private viewCtrl: ViewController
  ) {
    touchid.check().then(() => {
      this.viewCtrl.dismiss();
    });
  }

}
