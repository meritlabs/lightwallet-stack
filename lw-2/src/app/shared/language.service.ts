import { Injectable } from '@angular/core';
import { Logger } from '../core/logger';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from '../shared/config.service';

import * as _ from "lodash";

@Injectable()
export class LanguageService {
  private languages: Array<any> = [
    {
      name: 'English',
      isoCode: 'en'
    }, {
      name: 'Español',
      isoCode: 'es'
    }, {
      name: 'Français',
      isoCode: 'fr',
    }, {
      name: 'Italiano',
      isoCode: 'it',
    }, {
      name: 'Polski',
      isoCode: 'pl',
    }, {
      name: 'Deutsch',
      isoCode: 'de',
    }, {
      name: '日本語',
      isoCode: 'ja',
      useIdeograms: true,
    }, {
      name: '中文（简体）',
      isoCode: 'zh',
      useIdeograms: true,
    }, {
      name: 'Pусский',
      isoCode: 'ru',
    }, {
      name: 'Português',
      isoCode: 'pt',
    }
  ];
  private current: string;

  constructor(
    private logger: Logger,
    private translate: TranslateService,
    private config: ConfigService
  ) {
    this.logger.info('LanguageService initialized.');
    this.translate.onLangChange.subscribe((event) => {
      this.logger.info('Settings language changed to: ' + event.lang);
    });
  }

  public load() {
    let lang = this.config.get().wallet.settings.defaultLanguage;
    if (!_.isEmpty(lang)) this.current = lang;
    else {
      // Get from browser
      let browserLang = this.translate.getBrowserLang();
      let validBrowserLang = this.getName(browserLang) ? true : false;
      if (validBrowserLang) this.current = browserLang;
      else this.current = this.getDefault();
    }
    this.translate.setDefaultLang(this.current);
  }

  set(lang: string) {
    this.current = lang;
    this.translate.use(lang);
    this.config.set({wallet: { settings: { defaultLanguage: lang } } });
  }

  getName(lang: string) {
    return _.result(_.find(this.languages, {
      'isoCode': lang
    }), 'name');
  }

  getDefault() {
    return this.languages[0]['isoCode'];
  }

  getCurrent() {
    return this.current;
  }

  getCurrentName() {
    return this.getName(this.current);
  }

  getCurrentInfo() {
    return _.find(this.languages, {
      'isoCode': this.current
    });
  }

  getAvailables() {
    return this.languages;
  }

}