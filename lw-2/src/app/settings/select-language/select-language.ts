import { Component } from '@angular/core';
import { IonicComponent, NavController, NavParams, ViewController } from 'ionic-angular';
import {AlertController} from "ionic-angular/index";
import {ExternalLinkService} from "../../../../providers/external-link-service";


@IonicComponent()
@Component({
  selector: 'component-select-language',
  templateUrl: 'select-language.html',
})
export class SelectLanguageModal {

  currentLanguage;
  availableLanguages;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private  alertCtrl:AlertController,
    private externalService:ExternalLinkService,
    private viewCtrl:ViewController
  ) {
    this.currentLanguage = this.navParams.get('currentLanguage');
    this.availableLanguages = this.navParams.get('availableLanguages')
  }

  ionViewDidLoad() {
    //do something here
  }

  toCommunity() {
    //@TODO move to configs
    let url = 'https://github.com/meritlabs/lightwallet-stack';

    let confirm = this.alertCtrl.create({
      title: 'External link',
      message: 'You can see the latest developments and contribute to this open source app by visiting our project on GitHub',
      buttons: [
        {text: 'Cancel', role: 'cancel', handler: () => {}},
        {text: 'Open GitHub', handler: () => {this.externalService.open(url)} }
      ]
    });

    confirm.present();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(language) {
    this.viewCtrl.dismiss(language);
  }

}
