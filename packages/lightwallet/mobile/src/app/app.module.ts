import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { AppVersion } from '@ionic-native/app-version';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Clipboard } from '@ionic-native/clipboard';
import { Contacts } from '@ionic-native/contacts';
import { Diagnostic } from '@ionic-native/diagnostic';
import { FCM } from '@ionic-native/fcm';
import { File } from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TouchID } from '@ionic-native/touch-id';
import { IonicStorageModule } from '@ionic/storage';
import { CommonProvidersModule } from '@merit/common/common-providers.module';
import { AddressService } from '@merit/common/services/address.service';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';
import { MobilePushNotificationsService } from '@merit/common/services/mobile-push-notifications-service';
import { PollingNotificationsService } from '@merit/common/services/polling-notification.service';
import { PopupService } from '@merit/common/services/popup.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { VaultsService } from '@merit/common/services/vaults.service';
import { MeritLightWallet } from '@merit/mobile/app/app.component';
import { DeepLinkService } from '@merit/mobile/app/core/deep-link.service';
import { PopupService as MobilePopupService } from '@merit/mobile/app/core/popup.service';
import { AddressScannerService } from '@merit/mobile/app/utilities/import/address-scanner.service';
import { MobilePollingNotificationsService } from '@merit/mobile/services/mobile-polling-notifications.service';
import { TouchIdService } from '@merit/mobile/services/touch-id.service';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MomentModule } from 'ngx-moment';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { AlertService } from '@merit/common/services/alert.service';
import { MobileAlertService } from '../services/mobile-alert.service';
import { MobileToastControllerService } from '../services/mobile-toast-controller.service';

export function getProviders() {
  return [
    { provide: PopupService, useClass: MobilePopupService },
    { provide: PushNotificationsService, useClass: MobilePushNotificationsService },
    { provide: PollingNotificationsService, useClass: MobilePollingNotificationsService },
    { provide: ToastControllerService, useClass: MobileToastControllerService },
    { provide: AlertService, useClass: MobileAlertService },
    ContactsService,
    AddressScannerService,
    DeepLinkService,
    EmailNotificationsService,
    AddressService,
    TouchIdService,
    VaultsService,
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
  declarations: [MeritLightWallet],
  imports: [
    BrowserModule,
    MomentModule,
    CommonModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    IonicModule.forRoot(MeritLightWallet, {
      preloadModules: true,
      tabsHideOnSubPages: true,
      backButtonText: '',
      autocomplete: 'off',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    IonicStorageModule.forRoot(),
    CommonProvidersModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [MeritLightWallet],
  providers: [
    ...getProviders(),
    ...getIonicNativePlugins(),
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      deps: [AppSettingsService],
      multi: true,
    },
  ],
})
export class AppModule {}
