import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from '@app/app.component';

import { MomentModule } from 'angular2-moment';
import { CoreModule } from '@app/core/core.module';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    MomentModule,
    CoreModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
