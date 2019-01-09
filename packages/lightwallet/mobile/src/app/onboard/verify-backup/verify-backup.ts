import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { LoggerService } from '@merit/common/services/logger.service';

@IonicPage({
  defaultHistory: ['OnboardingView'],
})
@Component({
  selector: 'view-verify-backup',
  templateUrl: 'verify-backup.html',
})
export class VerifyBackupView {
  mnemonic: string;
  enteredPhrase: string[] = [];
  wordList: { word: string; selected: boolean }[] = [];

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private logger: LoggerService,
  ) {}

  ionViewDidLoad() {
    this.mnemonic = this.navParams.get('mnemonic');
    if (this.mnemonic) {
      this.wordList = _.shuffle(
        _.map(this.mnemonic.split(' '), word => ({
          word: word,
          selected: false,
        })),
      );
    } else {
      this.navCtrl.pop();
    }
  }

  selectedAll(): boolean {
    return _.every(this.wordList, 'selected');
  }

  toggleWord(wordObj: { word: string; selected: boolean }): void {
    wordObj.selected = !wordObj.selected;
    if (wordObj.selected) {
      this.enteredPhrase.push(wordObj.word);
    } else {
      this.enteredPhrase = this.enteredPhrase.filter(w => w != wordObj.word);
    }
  }

  resetWords(): void {
    _.each(this.wordList, word => {
      word.selected = false;
    });
    this.enteredPhrase = [];
  }

  toTransactView() {
    this.navCtrl.setRoot('TransactView');
    this.navCtrl.popToRoot();
  }

  validatePhrase(): void {
    if (this.enteredPhrase.join(' ') == this.mnemonic) {
      this.toTransactView();
    } else {
      this.logger.warn(`${this.enteredPhrase.join(' ')} did not equal`);
      this.logger.warn(this.mnemonic);
      this.failedAlert();
    }
  }

  private failedAlert(): void {
    this.alertController
      .create({
        title: 'Oops...',
        message:
          "The phrase you entered didn't match your backup phrase! " +
          'If you lose your wallet without a backup, it is lost for good!',
        buttons: [
          {
            text: 'Try Again',
            handler: this.resetWords,
          },
        ],
      })
      .present();
  }
}
