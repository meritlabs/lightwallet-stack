import { Component } from '@angular/core';
import { LoggerService } from '@merit/common/services/logger.service';

@Component({
  selector: 'view-settings-session-log',
  templateUrl: './settings-session-log.view.html',
  styleUrls: ['./settings-session-log.view.sass'],
})
export class SettingsSessionLogView {
  logLevel: number = 4;
  filteredLogs = [];
  logsString = '';

  constructor(private loggerService: LoggerService) {
    this.filterLogs();
  }

  setLevel(level: number) {
    this.logLevel = level;
    this.filterLogs();
  }

  copy() {
    // TODO(ibby): add copy capabilities
  }

  filterLogs() {
    this.filteredLogs = this.loggerService.getLogs(this.logLevel);

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
