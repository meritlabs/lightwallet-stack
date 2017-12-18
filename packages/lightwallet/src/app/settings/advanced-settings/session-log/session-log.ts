import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Logger } from 'merit/core/logger';

import { ToastConfig } from "merit/core/toast.config";
import { MeritToastController } from "merit/core/toast.controller";


@IonicPage()
@Component({
  selector: 'view-session-log',
  templateUrl: 'session-log.html',
})
export class SessionLogView {

  showSettingsBar:boolean = false;
  logLevel = 4;
  filteredLogs = [];
  logsString = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logger:Logger,
    private toastCtrl:MeritToastController
  ) {

  }

  ionViewDidLoad() {

    this.filterLogs();
  }

  copy() {
    this.toastCtrl.create({
      message: 'Session log copied to clipboard',
      cssClass: ToastConfig.CLASS_MESSAGE
    }).present();
  }

  filterLogs() {
    this.filteredLogs = this.logger.getLogs(this.logLevel);

    this.logsString = '';
    this.filteredLogs.forEach((log) => {
      this.logsString += `${(new Date(log.timestamp)).toString()}: ${this.getLogLevelName(log.level)} ${log.arguments.join("\n")}`;
    });

  }

  getLogLevelName(level:number) {
    return ['error', 'warn', 'info', 'debug'][level] || '';
  }

}
