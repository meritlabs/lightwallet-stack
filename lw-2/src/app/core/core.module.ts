import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Logger } from "./logger";


import { MomentModule } from 'angular2-moment';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [SpinnerComponent],
    declarations: [SpinnerComponent],
    providers: [
        Logger, 
        SpinnerService
        StatusBar,
        SplashScreen,
        Logger,
    ]
})

export class CoreModule {}