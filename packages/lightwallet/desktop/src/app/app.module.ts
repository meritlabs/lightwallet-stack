import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { CommonProvidersModule } from '@merit/common/common-providers.module';
import { AppEffects } from '@merit/common/effects/app.effects';
import { NotificationEffects } from '@merit/common/effects/notification.effects';
import { TransactionEffects } from '@merit/common/effects/transaction.effects';
import { WalletEffects } from '@merit/common/effects/wallet.effects';
import { IRootAppState, reducer } from '@merit/common/reducers';
import { UpdateAppAction } from '@merit/common/reducers/app.reducer';
import { AlertService } from '@merit/common/services/alert.service';
import { PollingNotificationsService } from '@merit/common/services/polling-notification.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { WebPushNotificationsService } from '@merit/common/services/web-push-notifications.service';
import { DOMController } from '@merit/desktop/app/components/dom.controller';
import { SharedComponentsModule } from '@merit/desktop/app/components/shared-components.module';
import { DashboardGuard } from '@merit/desktop/app/guards/dashboard.guard';
import { OnboardingGuard } from '@merit/desktop/app/guards/onboarding.guard';
import { DesktopAlertService } from '@merit/desktop/services/desktop-alert.service';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Platform } from 'ionic-angular/platform/platform';
import { Events } from 'ionic-angular/util/events';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MarketLoginView } from './market/market-login/market-login.view';
import { APP_BASE_HREF } from '@angular/common';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n');
}

export function loadConfigs(profileService: ProfileService, store: Store<IRootAppState>) {
  return async () => {
    const authorized = await profileService.isAuthorized();

    store.dispatch(
      new UpdateAppAction({
        loading: false,
        authorized,
      })
    );
  };
}

export function getProviders() {
  return [
    PollingNotificationsService,
    { provide: PushNotificationsService, useClass: WebPushNotificationsService },
    { provide: AlertService, useClass: DesktopAlertService },
    Events,
    Platform,
    DOMController,
    DashboardGuard,
    OnboardingGuard,
  ];
}

@NgModule({
  declarations: [AppComponent, MarketLoginView],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    CommonProvidersModule.forRoot(),
    CommonPipesModule,
    StoreModule.forRoot(reducer),
    ReactiveFormsModule,
    EffectsModule.forRoot([AppEffects, WalletEffects, TransactionEffects, NotificationEffects]),
    SharedComponentsModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
  ],
  providers: [
    ...getProviders(),
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      deps: [ProfileService, Store],
      multi: true,
    },
    {
      provide: APP_BASE_HREF,
      useValue: '/',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
