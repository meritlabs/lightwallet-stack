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
import { MeritLightWallet } from 'merit/app.component';
import { AppService } from 'merit/core/app-settings.service';
import { AppUpdateService } from 'merit/core/app-update.service';
import { BwcError } from 'merit/core/bwc-error.model';
import { BwcService } from 'merit/core/bwc.service';
import { DeepLinkService } from 'merit/core/deep-link.service';
import { LanguageService } from 'merit/core/language.service';
import { Logger } from 'merit/core/logger';
import { EmailNotificationsService } from 'merit/core/notification/email-notification.service';
import { PollingNotificationsService } from 'merit/core/notification/polling-notification.service';
import { PushNotificationsService } from 'merit/core/notification/push-notification.service';
import { PersistenceService } from 'merit/core/persistence.service';
import { PlatformService } from 'merit/core/platform.service';
import { PopupService } from 'merit/core/popup.service';
import { ProfileService } from 'merit/core/profile.service';
import { MeritToastController } from 'merit/core/toast.controller';
import { EasyReceiveService } from 'merit/easy-receive/easy-receive.service';
import { FeedbackService } from 'merit/feedback/feedback.service';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { MeritContactBuilder } from 'merit/shared/address-book/merit-contact.builder';
import { MeritContactService } from 'merit/shared/address-book/merit-contact.service';
import { ConfigService } from 'merit/shared/config.service';
import { FeeLevelModal } from 'merit/shared/fee/fee-level-modal';
import { FeeService } from 'merit/shared/fee/fee.service';
import { LedgerService } from 'merit/shared/ledger.service';
import { NotificationService } from 'merit/shared/notification.service';
import { TouchIdService } from 'merit/shared/touch-id/touch-id.service';
import { RateService } from 'merit/transact/rate.service';
import { EasySendService } from 'merit/transact/send/easy-send/easy-send.service';
import { SendService } from 'merit/transact/send/send.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { AddressScannerService } from 'merit/utilities/import/address-scanner.service';
import { DerivationPathService } from 'merit/utilities/mnemonic/derivation-path.service';
import { MnemonicService } from 'merit/utilities/mnemonic/mnemonic.service';
import { CreateVaultService } from 'merit/vaults/create-vault/create-vault.service';
import { RenewVaultService } from 'merit/vaults/renew-vault/renew-vault.service';
import { SpendVaultService } from 'merit/vaults/spend/vault-spend.service';
import { VaultsService } from 'merit/vaults/vaults.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { ContactsProvider } from '../providers/contacts/contacts';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Keyboard } from '@ionic-native/keyboard';
import { UnlockRequestService } from 'merit/core/unlock-request.service';

export function getProviders() {
  return [
    Logger,
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
    TouchIdService,
    EasyReceiveService,
    LedgerService,
    WalletService,
    MnemonicService,
    CreateVaultService,
    VaultsService,
    PollingNotificationsService,
    PushNotificationsService,
    EmailNotificationsService,
    AppUpdateService,
    FeedbackService,
    SendService,
    MeritContactBuilder,
    AddressBookService,
    MeritContactService,
    AddressScannerService,
    FeeService,
    RateService,
    EasySendService,
    NotificationService,
    FeeLevelModal,
    DerivationPathService,
    RenewVaultService,
    SpendVaultService,
    ContactsProvider,
    UnlockRequestService
  ];
}

export function getIonicNativePlugins() {
  return [
    BarcodeScanner,
    StatusBar,
    SplashScreen,
    TouchID,
    FCM,
    AndroidFingerprintAuth,
    InAppBrowser,
    Contacts,
    SocialSharing,
    Clipboard,
    File,
    Diagnostic,
    Keyboard
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
