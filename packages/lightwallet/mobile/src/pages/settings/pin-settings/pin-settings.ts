import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { PersistenceService } from '@merit/common/services/persistence.service';

@IonicPage()
@Component({
  selector: 'view-pin-settings',
  templateUrl: 'pin-settings.html',
})
export class PinSettingsView {
  enabled: boolean;

  constructor(private modalCtrl: ModalController, private persistenceService: PersistenceService) {}

  async ionViewWillEnter() {
    this.enabled = await this.persistenceService.isPinEnabled();
  }

  async togglePin(enable) {
    if (enable) {
      const modal = this.modalCtrl.create('PinLockView', { newPinMode: true });
      modal.onDidDismiss(async success => {
        if (!success) this.enabled = false;
      });
      modal.present();
    } else {
      const modal = this.modalCtrl.create('PinLockView', { showCancelButton: true });
      modal.onDidDismiss(async success => {
        if (success) {
          await this.persistenceService.setPin(null);
        } else {
          this.enabled = true;
        }
      });
      modal.present();
    }
  }
}
