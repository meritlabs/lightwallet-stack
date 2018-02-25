import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import * as _ from 'lodash';
import { Logger } from '@merit/mobile/app/core/logger';


@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'view-verify-backup',
  templateUrl: 'verify-backup.html',
})
export class VerifyBackupView {
  public mnemonic: string;
  public enteredPhrase: string[] = []
  public wordList: { word: string, selected: boolean }[] = [];

  constructor(public alertController: AlertController,
              public navCtrl: NavController,
              public navParams: NavParams,
              private logger: Logger,) {
  }

  ionViewDidLoad() {
    this.mnemonic = this.navParams.get('mnemonic');
    if (this.mnemonic) {
      this.wordList = _.shuffle(_.map(this.mnemonic.split(' '), (word) => ({
        word: word,
        selected: false
      })));
    } else {
      this.navCtrl.pop();
    }
  }

  public selectedAll(): boolean {
    return _.every(this.wordList, 'selected');
  }

  public toggleWord(wordObj: { word: string, selected: boolean }): void {
    wordObj.selected = !wordObj.selected;
    if (wordObj.selected) {
      this.enteredPhrase.push(wordObj.word);
    } else {
      this.enteredPhrase = this.enteredPhrase.filter(w => w != wordObj.word);
    }
  }

  public resetWords(): void {
    _.each(this.wordList, (word) => {
      word.selected = false;
    })
    this.enteredPhrase = [];
  }

  public toTransactView() {
    this.navCtrl.setRoot('TransactView');
    this.navCtrl.popToRoot();
  }

  public validatePhrase(): void {
    if (this.enteredPhrase.join(' ') == this.mnemonic) {
      this.toTransactView();
    } else {
      this.logger.warn(`${this.enteredPhrase.join(' ')} did not equal`);
      this.logger.warn(this.mnemonic);
      this.failedAlert();
    }
  }

  private failedAlert(): void {
    this.alertController.create({
      title: 'Oops...',
      message: 'The phrase you entered didn\'t match your backup phrase! ' +
      'If you lose your wallet without a backup, it is lost for good!',
      buttons: [{
        text: 'Try Again',
        handler: this.resetWords
      }]
    }).present();
  }
}
