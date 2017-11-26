import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import {EasyReceiveService} from "merit/easy-receive/easy-receive.service";
import {ProfileService} from "merit/core/profile.service";


@IonicPage({
  segment: 'easy'
})
@Component({
  selector: 'view-easy-receive',
  templateUrl: 'easy-receive.html',
})
export class EasyReceiveView {


  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private easyReceiveService:EasyReceiveService,
    private app:App,
    private profileService:ProfileService
  ) {

  }

}
