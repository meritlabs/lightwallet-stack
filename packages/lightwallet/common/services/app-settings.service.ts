import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '@merit/common/services/logger.service';
import { ConfigService } from '@merit/common/services/config.service';
import { LanguageService } from '@merit/common/services/language.service';

// TODO: Improve implementation
export interface AppSettings {
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
export class AppSettingsService {
  public info: AppSettings;
  private jsonPath: string = 'assets/appConfig.json';

  constructor(
    public http: HttpClient,
    private logger: LoggerService,
    private language: LanguageService,
    private config: ConfigService,
  ) {
    this.logger.info('AppService initialized.');
  }

  async getInfo(): Promise<AppSettings> {
    if (this.info) {
      return this.info;
    } else {
      return this.load();
    }
  }

  private async load(): Promise<AppSettings> {
    try {
      await this.config.load();
      await this.language.load();
      // TODO: Load TouchID here?
      this.info = await this.loadInfo();
      return this.info;
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }

  private loadInfo(): Promise<AppSettings> {
    return this.http.get<AppSettings>(this.jsonPath).toPromise();
  }
}
