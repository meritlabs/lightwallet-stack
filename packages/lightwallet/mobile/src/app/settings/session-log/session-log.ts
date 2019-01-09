import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoggerService } from '@merit/common/services/logger.service';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';

@IonicPage()
@Component({
  selector: 'view-session-log',
  templateUrl: 'session-log.html',
})
export class SessionLogView {
  logLevel = 4;
  filteredLogs = [];
  logsString = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logger: LoggerService,
    private toastCtrl: ToastControllerService,
  ) {}

  ionViewDidLoad() {
    this.filterLogs();
  }

  copy() {
    this.toastCtrl.message('Session log copied to clipboard');
  }

  filterLogs() {
    this.filteredLogs = this.logger.getLogs(this.logLevel);

    let logsString = '';

    this.filteredLogs.forEach(
      log =>
        (logsString += `${new Date(log.timestamp).toString()}: ${this.getLogLevelName(log.level)} ${log.arguments.join(
          '\n',
        )}`),
    );

    this.logsString = logsString;
  }

  getLogLevelName(level: number) {
    return ['error', 'warn', 'info', 'debug'][level] || '';
  }
}
