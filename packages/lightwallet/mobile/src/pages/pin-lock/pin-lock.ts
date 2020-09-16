import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { TouchIdService } from '@merit/mobile/services/touch-id.service';

@IonicPage()
@Component({
  selector: 'view-pin-lock',
  templateUrl: 'pin-lock.html',
})
export class PinLockView {
  pin: string = '';

  error: boolean;
  isTouchIdAvailable: boolean;

  pinBlockedUntil: number;
  blocked: boolean;
  blockedText: string;
  attempts: number = 0;

  readonly MAX_ATTEMPTS = 10;
  readonly BLOCK_FOR_MINUTES = 10;

  timerId: NodeJS.Timer;

  showCancelButton: boolean;
  mode: string;

  storedPin: string;

  constructor(
    private persistenceService: PersistenceService,
    private platform: Platform,
    private viewCtrl: ViewController,
    private touchIdService: TouchIdService,
    private navParams: NavParams,
  ) {
    if (this.navParams.get('newPinMode')) {
      this.mode = 'new';
      this.showCancelButton = true;
    } else {
      this.mode = 'check';
      this.showCancelButton = this.navParams.get('showCancelButton');
    }
  }

  async ionViewWillEnter() {
    if (this.mode == 'check' && !this.navParams.get('touchIdDisabled')) {
      this.isTouchIdAvailable = await this.touchIdService.isAvailable();
      if (this.isTouchIdAvailable) {
        this.touchIdService.check().then(() => {
          this.viewCtrl.dismiss(true);
        });
      }
    }

    this.timerId = setInterval(this.checkIsBlocked.bind(this), 5000);
  }

  ionViewWillLeave() {
    clearInterval(this.timerId);
  }

  async checkIsBlocked() {
    this.pinBlockedUntil = await this.persistenceService.getPinBlockedTimestamp();
    const diff = this.pinBlockedUntil - Date.now();
    if (!this.pinBlockedUntil || diff <= 0) {
      this.blocked = false;
      this.blockedText = null;
    } else {
      const minutes = Math.ceil(diff / 60000);
      this.blocked = true;
      this.blockedText = `You can try again in ${minutes > 1 ? minutes + ' minutes' : 'one minute'}`;
    }
  }

  async enter(number) {
    if (this.error || this.blocked) return;
    if (this.pin.length < 4) {
      this.pin += number;
      if (this.pin.length == 4) {
        if (this.mode == 'check') {
          setTimeout(this.checkPin.bind(this), 200);
        } else if (this.mode == 'repeat') {
          setTimeout(this.comparePin.bind(this), 200);
        } else if (this.mode == 'new') {
          setTimeout(() => {
            this.storedPin = this.pin;
            this.pin = '';
            this.mode = 'repeat';
          }, 200);
        }
      }
    }
  }

  private async checkPin() {
    this.attempts++;
    if (await this.persistenceService.checkPin(this.pin)) {
      this.viewCtrl.dismiss(true);
    } else {
      this.error = true;
      if (this.attempts >= this.MAX_ATTEMPTS) {
        this.blocked = true;
        this.checkIsBlocked();
        this.pinBlockedUntil = Date.now() + 1000 * 60 * this.BLOCK_FOR_MINUTES;
        this.persistenceService.blockPin(this.pinBlockedUntil);
        this.attempts = 0;
      }
      setTimeout(() => {
        this.pin = '';
        this.error = false;
      }, 100);
    }
  }

  private async comparePin(pin) {
    if (this.pin == this.storedPin) {
      await this.persistenceService.setPin(this.pin);
      this.viewCtrl.dismiss(true);
    } else {
      this.error = true;
      setTimeout(() => {
        this.pin = '';
        this.error = false;
      }, 100);
    }
  }

  backspace() {
    if (this.error || this.blockedText || this.pin.length == 4) return;
    this.pin = this.pin.slice(0, -1);
  }

  close() {
    this.viewCtrl.dismiss(false);
  }
}
