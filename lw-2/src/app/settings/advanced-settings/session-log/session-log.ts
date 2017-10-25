import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Logger} from "../../../../../providers/logger";


@IonicPage()
@Component({
  selector: 'component-session-log',
  templateUrl: 'session-log.html',
})
export class SessionLogComponent {

  showSettingsBar:boolean = false;
  logLevel = 4;
  filteredLogs = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logger:Logger
  ) {

  }

  ionViewDidLoad() {
    //TODO TEMP!
    this.logger.error('test', 'test');
    this.logger.warn('test', 'test');
    this.logger.info('test', 'test');
    this.logger.debug('test', 'test');


    this.filterLogs();
  }

  copy() {
    //todo copy
  }

  filterLogs() {
    this.filteredLogs = this.logger.getLogs(this.logLevel);
  }

  getLogLevelName(level:number) {
    return ['error', 'warn', 'info', 'debug'][level] || '';
  }

}
