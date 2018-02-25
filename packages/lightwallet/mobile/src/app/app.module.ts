import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Clipboard } from '@ionic-native/clipboard';
import { Contacts } from '@ionic-native/contacts';
import { FCM } from '@ionic-native/fcm';
import { File } from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TouchID } from '@ionic-native/touch-id';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MomentModule } from 'angular2-moment';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MeritLightWallet } from '@merit/mobile/app/app.component';
import { AppService } from '@merit/mobile/app/core/app-settings.service';
import { AppUpdateService } from '@merit/mobile/app/core/app-update.service';
import { BwcError } from '@merit/mobile/app/core/bwc-error.model';
import { BwcService } from '@merit/mobile/app/core/bwc.service';
import { DeepLinkService } from '@merit/mobile/app/core/deep-link.service';
import { LanguageService } from '@merit/mobile/app/core/language.service';
import { EmailNotificationsService } from '@merit/mobile/app/core/notification/email-notification.service';
import { PollingNotificationsService } from '@merit/mobile/app/core/notification/polling-notification.service';
import { PushNotificationsService } from '@merit/mobile/app/core/notification/push-notification.service';
import { PersistenceService } from '@merit/mobile/app/core/persistence.service';
import { PlatformService } from '@merit/mobile/app/core/platform.service';
import { PopupService } from '@merit/mobile/app/core/popup.service';
import { ProfileService } from '@merit/mobile/app/core/profile.service';
import { MeritToastController } from '@merit/mobile/app/core/toast.controller';
import { EasyReceiveService } from '@merit/mobile/app/easy-receive/easy-receive.service';
import { FeedbackService } from '@merit/mobile/app/feedback/feedback.service';
import { ConfigService } from '@merit/mobile/app/shared/config.service';
import { FeeLevelModal } from '@merit/mobile/app/shared/fee/fee-level-modal';
import { FeeService } from '@merit/mobile/app/shared/fee/fee.service';
import { LedgerService } from '@merit/mobile/app/shared/ledger.service';
import { TouchIdService } from '@merit/mobile/app/shared/touch-id/touch-id.service';
import { RateService } from '@merit/mobile/app/transact/rate.service';
import { EasySendService } from '@merit/mobile/app/transact/send/easy-send/easy-send.service';
import { SendService } from '@merit/mobile/app/transact/send/send.service';
import { TxFormatService } from '@merit/mobile/app/transact/tx-format.service';
import { AddressScannerService } from '@merit/mobile/app/utilities/import/address-scanner.service';
import { DerivationPathService } from '@merit/mobile/app/utilities/mnemonic/derivation-path.service';
import { MnemonicService } from '@merit/mobile/app/utilities/mnemonic/mnemonic.service';
import { CreateVaultService } from '@merit/mobile/app/vaults/create-vault/create-vault.service';
import { RenewVaultService } from '@merit/mobile/app/vaults/renew-vault/renew-vault.service';
import { SpendVaultService } from '@merit/mobile/app/vaults/spend/vault-spend.service';
import { VaultsService } from '@merit/mobile/app/vaults/vaults.service';
import { ContactsProvider as MobileContactsProvider } from '../providers/contacts';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Keyboard } from '@ionic-native/keyboard';
import { UnlockRequestService } from '@merit/mobile/app/core/unlock-request.service';
import { AppVersion } from '@ionic-native/app-version';
import { ContactsProvider } from '@merit/common/providers/contacts';
import { WalletService } from '@merit/common/providers/wallet';
import { Logger } from '@merit/common/providers/logger';

export function getProviders() {
  return [
    AddressScannerService,
    AppService,
    AppUpdateService,
    BwcError,
    BwcService,
    ConfigService,
    { provide: ContactsProvider, useClass: MobileContactsProvider },
    CreateVaultService,
    DeepLinkService,
    DerivationPathService,
    EasyReceiveService,
    EasySendService,
    EmailNotificationsService,
    FeedbackService,
    FeeLevelModal,
    FeeService,
    LanguageService,
    LedgerService,
    Logger,
    MeritToastController,
    MnemonicService,
    PersistenceService,
    PlatformService,
    PollingNotificationsService,
    PopupService,
    ProfileService,
    PushNotificationsService,
    RateService,
    RenewVaultService,
    SendService,
    SpendVaultService,
    TouchIdService,
    TxFormatService,
    UnlockRequestService,
    VaultsService,
    WalletService
  ];
}

export function getIonicNativePlugins() {
  return [
    AndroidFingerprintAuth,
    AppVersion,
    BarcodeScanner,
    Clipboard,
    Contacts,
    Diagnostic,
    FCM,
    File,
    InAppBrowser,
    Keyboard,
    SocialSharing,
    SplashScreen,
    StatusBar,
    TouchID,
  ];
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n');
}

export function loadConfigs(appService) {
  return () => appService.getInfo();
}

@NgModule({
  declarations: [
    MeritLightWallet,
  ],
  imports: [
    BrowserModule,
    MomentModule,
    CommonModule,
    HttpClientModule,
    IonicModule.forRoot(MeritLightWallet, {
      preloadModules: true,
      tabsHideOnSubPages: true,
      backButtonText: ''
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MeritLightWallet
  ],
  providers: [
    ...getProviders(),
    ...getIonicNativePlugins(),
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      deps: [AppService],
      multi: true
    }
  ]
})
export class AppModule {
}
