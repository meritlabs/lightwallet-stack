import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MeritLightWallet } from 'merit/app.component';
import { OnboardingView } from 'merit/onboard/onboarding.view';
import { TransactView } from 'merit/transact/transact';

import { MomentModule } from 'angular2-moment';
import { CoreModule } from 'merit/core/core.module';



// App Module
@NgModule({
  declarations: [
    MeritLightWallet
  ],
  imports: [
    BrowserModule,
    MomentModule,
    CoreModule,
    IonicModule.forRoot(MeritLightWallet),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MeritLightWallet
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
