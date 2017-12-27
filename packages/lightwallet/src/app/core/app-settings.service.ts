import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Logger } from 'merit/core/logger';
import 'rxjs/add/operator/map';

import { LanguageService } from 'merit/core/language.service';
import { ConfigService } from 'merit/shared/config.service';
import { TouchIdService } from 'merit/shared/touch-id/touch-id.service';
import { Observable } from 'rxjs/Observable';

import * as Promise from 'bluebird';


// TODO: Improve implementation
interface AppSettings {
  packageName: string;
  packageDescription: string;
  packageNameId: string;
  themeColor: string;
  userVisibleName: string;
  purposeLine: string;
  bundleName: string;
  appUri: string;
  name: string;
  nameNoSpace: string;
  nameCase: string;
  nameCaseNoSpace: string;
  gitHubRepoName: string;
  gitHubRepoUrl: string;
  gitHubRepoBugs: string;
  disclaimerUrl: string;
  url: string;
  appDescription: string;
  winAppName: string;
  WindowsStoreIdentityName: string;
  WindowsStoreDisplayName: string;
  windowsAppId: string;
  pushSenderId: string;
  description: string;
  version: string;
  androidVersion: string;
  commitHash: string;
  gcmSenderId: string;
  _extraCSS: string;
  _enabledExtensions: object;
}

@Injectable()
export class AppService {
  public info: AppSettings;
  private jsonPath: string = 'assets/appConfig.json';

  constructor(
    public http: HttpClient,
    private logger: Logger,
    private language: LanguageService,
    private config: ConfigService,
    private touchid: TouchIdService
  ) {
    this.logger.info('AppService initialized.');
  }

  public getInfo():Promise<any> {
    if (this.info) {
      return Promise.resolve(this.info);
    } else {
      return this.load();
    }
  }

  private load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.config.load().then(() => {
        this.language.load();
        // TODO: Load TouchID here?
        this.loadInfo().subscribe((info) => {
          this.info = info;
          resolve(info);
        });
      }).catch((err) => {
        this.logger.error(err);
        reject();
      });
    });
  }


  private loadInfo(): Observable<AppSettings> {
    return <any>this.http.get(this.jsonPath);
  }
}
