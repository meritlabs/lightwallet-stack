import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { StatusBar } from '@ionic-native/status-bar';
import { Logger } from "./logger";
import { BwcService } from 'merit/core/bwc.service';
import { PersistenceService } from 'merit/core/persistence.service';
import { BwcError } from 'merit/core/bwc-error.model';
import { PlatformService } from 'merit/core/platform.service';

import { ProfileService } from 'merit/core/profile.service';
import { CreateVaultService } from 'merit/vaults/create-vault/create-vault.service';
import { VaultsService } from 'merit/vaults/vaults.service';

import { LanguageService } from 'merit/core/language.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { AppService } from 'merit/core/app-settings.service';
import { TransactModule } from 'merit/transact/transact.module';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { TouchIdService } from 'merit/shared/touch-id/touch-id.service';
import { TouchID } from '@ionic-native/touch-id';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { PopupService } from 'merit/core/popup.service';
import { TransactView } from 'merit/transact/transact';
import { OnboardingView } from 'merit/onboard/onboarding.view';

import { MomentModule } from 'angular2-moment';

import { ConfigService } from 'merit/shared/config.service';
import { MeritToastController } from "merit/core/toast.controller";
import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";
import { WalletService } from "merit/wallets/wallet.service";

import { DeepLinkService } from "merit/core/deep-link.service";
import { EasyReceiveService } from 'merit/easy-receive/easy-receive.service';

import { LedgerService } from 'merit/shared/ledger.service';
import { NotificationModule } from 'merit/core/notification/notification.module';

import { IonicStorageModule } from '@ionic/storage';

/* 
  The core module exists to make commonly used singleton services available 
  for use in other modules.  
  The goal, over time, is to make this module leaner and tighter as we continue
  to evolve the application.
*/

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n');
  }

export function loadConfigs(appService) {
  return () => appService.getInfo();
}

  // Ideally, we can remove the transaction dependency.
@NgModule({ 
    imports: [
        CommonModule,
        TransactModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [HttpClient]
            }
          }),
          IonicStorageModule.forRoot(),
          NotificationModule        
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
        PopupService,
        MeritToastController, 
        DeepLinkService,
        PersistenceService,
        PlatformService,
        ProfileService,
        LanguageService,
        TxFormatService,
        AppService,
        ConfigService,
        AndroidFingerprintAuth,
        TouchID,
        TouchIdService, 
        EasyReceiveService, 
        DeepLinkService,
        LedgerService,
        WalletService,
        MnemonicService,
        CreateVaultService,
        VaultsService,
        HttpClient,
        FCM,
        {
            provide: APP_INITIALIZER,
            useFactory: loadConfigs,
            deps: [AppService],
            multi: true
        }
    ]
})

export class CoreModule {}
