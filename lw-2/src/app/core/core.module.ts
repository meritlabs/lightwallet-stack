import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Logger } from "./logger";


import { MomentModule } from 'angular2-moment';

// The core module exists to make commonly used singleton services available 
// for use in other modules.  
@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [],
    declarations: [],
    providers: [
        Logger, 
        StatusBar,
        SplashScreen,
        Logger,
    ]
})

export class CoreModule {}