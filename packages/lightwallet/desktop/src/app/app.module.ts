import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { CommonDirectivesModule } from '@merit/common/common-directives.module';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { CommonProvidersModule } from '@merit/common/common-providers.module';
import { AppEffects } from '@merit/common/effects/app.effects';
import { GoalEffects } from '@merit/common/effects/goal.effects';
import { InterfacePreferencesEffects } from '@merit/common/effects/interface-preferences.effects';
import { NotificationEffects } from '@merit/common/effects/notification.effects';
import { TransactionEffects } from '@merit/common/effects/transaction.effects';
import { WalletEffects } from '@merit/common/effects/wallet.effects';
import { IRootAppState, reducer } from '@merit/common/reducers';
import { UpdateAppAction } from '@merit/common/reducers/app.reducer';
import { AlertService } from '@merit/common/services/alert.service';
import { GoalsService } from '@merit/common/services/goals.service';
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

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n');
}

export function loadConfigs(profileService: ProfileService, store: Store<IRootAppState>, goalsService: GoalsService) {
  return async () => {
    const authorized = Boolean(await profileService.isAuthorized());

    store.dispatch(
      new UpdateAppAction({
        loading: false,
        authorized,
      }),
    );

    await goalsService.loadGoals();
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
  declarations: [AppComponent],
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
    EffectsModule.forRoot([
      AppEffects,
      WalletEffects,
      TransactionEffects,
      NotificationEffects,
      GoalEffects,
      InterfacePreferencesEffects,
    ]),
    SharedComponentsModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    CommonDirectivesModule,
  ],
  providers: [
    ...getProviders(),
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      deps: [ProfileService, Store, GoalsService],
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
