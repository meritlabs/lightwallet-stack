import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LanguageService } from 'merit/core/language.service';
import { Logger } from 'merit/core/logger';
import { ConfigService } from 'merit/shared/config.service';
import { TouchIdService } from 'merit/shared/touch-id/touch-id.service';

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

  constructor(public http: HttpClient,
              private logger: Logger,
              private language: LanguageService,
              private config: ConfigService,
              private touchid: TouchIdService) {
    this.logger.info('AppService initialized.');
  }

  async getInfo() {
    if (this.info) {
      return this.info;
    } else {
      return this.load();
    }
  }

  private async load() {
    try {
      await this.config.load();
      await this.language.load();
      // TODO: Load TouchID here?
      this.info = await this.loadInfo();
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }


  private loadInfo(): Promise<AppSettings> {
    return this.http.get<AppSettings>(this.jsonPath).toPromise();
  }
}
