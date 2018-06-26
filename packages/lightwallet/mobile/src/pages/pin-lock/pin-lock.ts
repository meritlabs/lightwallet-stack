import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { PersistenceService } from '@merit/common/services/persistence.service';

@IonicPage()
@Component({
  selector: 'view-pin-lock',
  templateUrl: 'pin-lock.html',
})
export class PinLockView {

  pin: string = '';

  error:boolean;
  isTouchIdAvailable: boolean;

  constructor(
    private persistenceService: PersistenceService,
    private platform: Platform,
    private viewCtrl: ViewController
  ) {
    this.isTouchIdAvailable =  this.platform.is('cordova');
  }

  async enter(number) {
    if (this.pin.length < 4) this.pin += number;

    if (this.pin.length == 4) {
      setTimeout(this.checkPin.bind(this), 200);
    }
  }

  private async checkPin() {
    if (await this.persistenceService.checkPin(this.pin)) {
      this.viewCtrl.dismiss();
    } else {
      this.error = true;
      setTimeout(() => {
        this.pin = '';
        this.error = false;
      }, 100);
    }
  }

  backspace() {
    this.pin = this.pin.slice(0, -1);
  }

}
