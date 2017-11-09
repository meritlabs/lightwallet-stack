import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Promise } from 'bluebird';


@Injectable()
export class PopupService {
  constructor(public alertCtrl: AlertController) {
  }

  ionicAlert(title: string, subTitle?: string, okText?: string): void {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [okText]
    });
    alert.present();
  };

  ionicConfirm(title, message, okText, cancelText, confirmFunc = null, rejectFunc = null): void {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: cancelText,
          handler: () => {
            console.log('Disagree clicked');
            if (rejectFunc) {
              rejectFunc();
            }
          }
        },
        {
          text: okText,
          handler: () => {
            console.log('Agree clicked');
            if (confirmFunc) {
              confirmFunc();
            }
          }
        }
      ]
    });
    confirm.present();
  };

  ionicPrompt(title: string, message: string, okText?: string, cancelText?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let prompt = this.alertCtrl.create({
        title: title,
        message: message,
        inputs: [
          {
            name: 'title',
            placeholder: 'Title'
          },
        ],
        buttons: [
          {
            text: cancelText,
            handler: data => {
              console.log('Cancel clicked');
              reject(data);
            }
          },
          {
            text: okText,
            handler: data => {
              console.log('Saved clicked');
              resolve(data);
            }
          }
        ]
      });
      prompt.present();
    });
  }
}
