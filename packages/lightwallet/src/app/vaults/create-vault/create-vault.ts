import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";


@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-create-vault',
  templateUrl: 'create-vault.html',
})
export class CreateVaultView {
}