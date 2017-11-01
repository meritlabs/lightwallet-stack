import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Logger } from "./logger";
import { BwcService } from 'merit/core/bwc.service';
import { PersistenceService, persistenceServiceFactory } from 'merit/core/persistence.service';
import { BwcError } from 'merit/core/bwc-error.model';
import { PlatformService } from 'merit/core/platform.service';

import { ProfileService } from 'merit/core/profile.service';

import { LanguageService } from 'merit/core/language.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { AppService } from 'merit/core/app-settings.service';
import { TransactModule } from 'merit/transact/transact.module';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslatePoHttpLoader } from '@biesbjerg/ngx-translate-po-http-loader';
import { TouchIdService } from 'merit/shared/touch-id/touch-id.service';
import { TouchID } from '@ionic-native/touch-id';
import { PopupService } from 'merit/core/popup.service';
import { SpinnerService } from 'merit/core/spinner.service';
import { TransactView } from 'merit/transact/transact';
import { OnboardingView } from 'merit/onboard/onboarding.view';



import { MomentModule } from 'angular2-moment';


import { ConfigService } from 'merit/shared/config.service';
import {ConfigServiceMock} from "merit/shared/config.service.mock";
import {ProfileServiceMock} from "./profile.service.mock";
import {TxFormatServiceMock} from "../transact/tx-format.sevice.mock";

/* 
  The core module exists to make commonly used singleton services available 
  for use in other modules.  
  The goal, over time, is to make this module leaner and tighter as we continue
  to evolve the application.
*/

export function createTranslateLoader(http: Http) {
    return new TranslatePoHttpLoader(http, 'assets/i18n', '.po');
  }
 
  // Ideally, we can remove the transaction dependency.
@NgModule({
    imports: [
        CommonModule,
        TransactModule,
        HttpModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [Http]
            }
          })        
    ],
    exports: [],
    declarations: [
    ],
    providers: [
        Logger,
        StatusBar,
        SplashScreen,
        BwcService,
        BwcError,
        {
            provide: PersistenceService,
            useFactory: persistenceServiceFactory,
            deps: [PlatformService, Logger],
            multi: false
        },
        PlatformService,
        ProfileService,
        LanguageService,
        TxFormatService,
        AppService,
        ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: (app: AppService) => () => app.load(),
            deps: [AppService, LanguageService],
            multi: true
        },
        PopupService,
        SpinnerService,
      {
          provide: TouchIdService,
          deps: [TouchID],
          multi: false
      }
    ]
})

export class CoreModule {}