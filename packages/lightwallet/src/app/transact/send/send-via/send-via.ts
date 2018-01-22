import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';
import { SendService } from 'merit/transact/send/send.service';
import * as _ from 'lodash';
import { SendMethod } from 'merit/transact/send/send-method.model';


@IonicPage()
@Component({
  selector: 'view-send-via',
  templateUrl: 'send-via.html',
})
export class SendViaView {

  public contact:MeritContact;
  public amount:number;
  public highlightedMethod:SendMethod;
  public suggestedMethod:SendMethod;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private sendService: SendService
  ) {
    this.contact = this.navParams.get('contact');
    this.amount = this.navParams.get('amount');
    this.suggestedMethod = this.navParams.get('suggestedMethod');
  }

  async ionViewDidLoad() {

    let searchIn = (method) => {
      if (method.destination == SendMethod.DESTINATION_SMS) {
        return  'phoneNumbers';
      } else if (method.destination == SendMethod.DESTINATION_EMAIL) {
        return 'emails';
      } else if (method.destination == SendMethod.DESTINATION_ADDRESS) {
        return 'meritAddresses'
      }
    };

    if (this.suggestedMethod) {
      let entities:Array<any> = this.contact[searchIn(this.suggestedMethod)];
      if (entities.some(entity => entity.value == this.suggestedMethod.value)) {
          this.highlightedMethod = this.suggestedMethod;
          return true;
      }
    }

    if (!this.highlightedMethod) {
      this.sendService.getSendHistory().then((sendHistory) => {
        sendHistory.sort((a,b) => b.timestamp - a.timestamp);
        sendHistory.some((record) => {
          let entities:Array<any> = this.contact[searchIn(this.suggestedMethod)];
          if (entities.some((entity) => { return  entity.value == record.method.value } )) {
            this.highlightedMethod = record;
            return true;
          }
        });
      });
    }
  }

  getDisplayedName() {
    if (this.contact.name && this.contact.name.formatted) {
      return this.contact.name.formatted;
    } else {
      return this.suggestedMethod.value;
    }
  }

  editContact() {
    this.navCtrl.push('SendEditContactView', {contact: this.contact, amount: this.amount});
  }

  select(type, destination, value) {
    this.navCtrl.push('SendAmountView', {contact: this.contact, amount: this.amount, suggestedMethod: new SendMethod({type, destination, value})});
  }

  showClassicTooltip() {
    let title = 'Classic Send';
    let text= 'ClassicSend transactions do not have power of EasySend, but fee size is lower.';
    this.showTooltip(title, text);
  }

  showEasyTooltip() {
    let title = 'Easy Send';
    let text= 'EasySend transactions could be returned, password protected and limited by expiration time. You can send Merit either to existing merit address or share a link via sms/email';
    this.showTooltip(title, text);
  }

  private showTooltip(title, message) {
    this.alertCtrl.create({title, message}).present();
  }

}
