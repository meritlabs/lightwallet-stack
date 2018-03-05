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
import { DeepLinkService } from '@merit/mobile/app/core/deep-link.service';
import { EmailNotificationsService } from '@merit/mobile/app/core/notification/email-notification.service';
import { PollingNotificationsService } from '@merit/mobile/app/core/notification/polling-notification.service';
import { PushNotificationsService } from '@merit/mobile/app/core/notification/push-notification.service';
import { PopupService } from '@merit/common/services/popup.service';
import { PopupService as MobilePopupService } from '@merit/mobile/app/core/popup.service';
import { AddressScannerService } from '@merit/mobile/app/utilities/import/address-scanner.service';
import { CreateVaultService } from '@merit/mobile/app/vaults/create-vault/create-vault.service';
import { RenewVaultService } from '@merit/mobile/app/vaults/renew-vault/renew-vault.service';
import { SpendVaultService } from '@merit/mobile/app/vaults/spend/vault-spend.service';
import { VaultsService } from '@merit/mobile/app/vaults/vaults.service';
import { ContactsService, ContactsService as MobileContactsProvider } from '../services/contacts.service';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Keyboard } from '@ionic-native/keyboard';
import { AppVersion } from '@ionic-native/app-version';
import { TouchIdService } from '@merit/mobile/services/touch-id.service';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { CommonProvidersModule } from '@merit/common/common-providers.module';
import { MeritToastController } from '@merit/common/services/toast.controller.service';
import { SendService } from '@merit/common/services/send.service';

export function getProviders() {
  return [
    { provide: ContactsService, useClass: MobileContactsProvider },
    { provide: PopupService, useClass: MobilePopupService },
    AddressScannerService,
    CreateVaultService,
    DeepLinkService,
    EmailNotificationsService,
    MeritToastController,
    PollingNotificationsService,
    PushNotificationsService,
    RenewVaultService,
    SendService,
    SpendVaultService,
    TouchIdService,
    VaultsService
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
    IonicStorageModule.forRoot(),
    CommonProvidersModule.forRoot()
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
      deps: [AppSettingsService],
      multi: true
    }
  ]
})
export class AppModule {
}
