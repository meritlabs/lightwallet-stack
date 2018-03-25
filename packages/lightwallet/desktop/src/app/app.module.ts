import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { CommonPipesModule } from '@merit/common/common-pipes.module';
import { CommonProvidersModule } from '@merit/common/common-providers.module';
import { AppEffects } from '@merit/common/effects/app.effects';
import { TransactionEffects } from '@merit/common/effects/transaction.effects';
import { WalletEffects } from '@merit/common/effects/wallet.effects';
import { reducer } from '@merit/common/reducers';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { DOMController } from '@merit/desktop/app/components/dom.controller';
import { SharedComponentsModule } from '@merit/desktop/app/components/shared-components.module';
import { DashboardGuard } from '@merit/desktop/app/guards/dashboard.guard';
import { OnboardingGuard } from '@merit/desktop/app/guards/onboarding.guard';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Platform } from 'ionic-angular/platform/platform';
import { Events } from 'ionic-angular/util/events';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    DOMController,
    DashboardGuard,
    OnboardingGuard
  ];
}

@NgModule({
  declarations: [
    AppComponent
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
    ]),
    SharedComponentsModule.forRoot()
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
