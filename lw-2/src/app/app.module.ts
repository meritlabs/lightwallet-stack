import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import {ProfileService} from "../providers/profile-service";
import {ProfileProviderMock} from "../providers/mocks/profile";
import {Logger} from "../providers/logger";

import { MomentModule } from 'angular2-moment';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    MomentModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Logger,
    {provide: ProfileService, useClass: ProfileProviderMock},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
