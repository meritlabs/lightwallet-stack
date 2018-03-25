import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { AppEffects } from '@merit/common/effects/app.effects';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { DashboardGuard } from '@merit/desktop/app/guards/dashboard.guard';
import { OnboardingGuard } from '@merit/desktop/app/guards/onboarding.guard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Events } from 'ionic-angular/util/events';
import { Platform } from 'ionic-angular/platform/platform';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import { reducer } from '@merit/common/reducers';
import { EffectsModule } from '@ngrx/effects';
import { WalletEffects } from '@merit/common/effects/wallet.effects';
import { CommonProvidersModule } from '@merit/common/common-providers.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionEffects } from '@merit/common/effects/transaction.effects';
import { WebPushNotificationsService } from '@merit/common/services/web-push-notifications.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n');
}

export function loadConfigs(appService) {
  return () => appService.getInfo();
}

export function getProviders() {
  return [
    Events,
    Platform,
    DashboardGuard,
    OnboardingGuard
  ];
}

@NgModule({
  declarations: [
    AppComponent,
  ],
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
        deps: [HttpClient]
      }
    }),
    CommonProvidersModule.forRoot(),
    CommonPipesModule,
    StoreModule.forRoot(reducer),
    ReactiveFormsModule,
    EffectsModule.forRoot([
      AppEffects,
      WalletEffects,
      TransactionEffects
    ])
  ],
  providers: [
    ...getProviders(),
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      deps: [AppSettingsService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
