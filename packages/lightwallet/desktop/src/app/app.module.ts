import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n');
}
export function getProviders() {
  return [
    Events,
    Platform
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
    StoreModule.forRoot(reducer),
    EffectsModule.forRoot([
      WalletEffects
    ]),
    CommonProvidersModule.forRoot(),
    StoreDevtoolsModule.instrument()
  ],
  providers: [
    ...getProviders()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
