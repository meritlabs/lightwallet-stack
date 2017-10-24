import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { MomentModule } from 'angular2-moment';
import {ToastController as MeritToastController} from '../shared/toast/toast.controller';
import {LoggerService} from "../shared/logger.service";
import {WalletService} from "../shared/wallet.service";
import {BwcService} from "../shared/bwc.service";
import {TxFormatService} from "../shared/tx-format.service";

import {HttpModule, Http} from '@angular/http';
import {ConfigService} from "../shared/config.service";
import {AppSettingsService} from "../shared/app-settings.service";
import {LanguageService} from "../shared/language.service";
import {MnemonicService} from "../shared/mnemonic.service";
import {PersistenceService} from "../shared/persistence.service";
import {PlatformService} from "../shared/platform.service";
import {ProfileService} from "../shared/profile.service";
import {RateService} from "../shared/rate.service";

import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import {TouchIdService} from "../shared/touchid.service";
import { TouchID } from '@ionic-native/touch-id';


import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
//import { TranslatePoHttpLoader } from '@biesbjerg/ngx-translate-po-http-loader';

export function createTranslateLoader(http: Http) {

}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    MomentModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    AndroidFingerprintAuth,
    StatusBar,
    SplashScreen,
    LoggerService,
    ConfigService,
    AppSettingsService,
    LanguageService,
    MnemonicService,
    PersistenceService,
    PlatformService,
    ProfileService,
    RateService,
    TouchID,
    TouchIdService,
    TxFormatService,
    WalletService,
    BwcService,
    TxFormatService,
    {provide: ToastController, useClass: MeritToastController},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
