import { Component } from '@angular/core';
import { IonicPage, AlertController } from 'ionic-angular';
import { PersistenceService } from '@merit/common/services/persistence.service';


@IonicPage()
@Component({
  selector: 'view-pin-settings',
  templateUrl: 'pin-settings.html',
})
export class PinSettingsView {

  enabled: boolean;

  constructor(
    private alertCtrl: AlertController,
    private persistenceService: PersistenceService
  ) {
  }

  async ionViewWillEnter() {
    this.enabled = await this.persistenceService.isPinEnabled();
  }

  async togglePin(isEnabled) {
    if (isEnabled) {
      await this.persistenceService.setPin(1234); //temp
    } else {
      await this.persistenceService.setPin(null);
    }
  }

}
