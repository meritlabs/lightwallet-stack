import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Logger } from "./logger";
import { BwcService } from 'merit/core/bwc.service';
import { PersistenceService } from 'merit/core/persistence.service';
import { BwcError } from 'merit/core/bwc-error.model';
import { PlatformService } from 'merit/core/platform.service';
import { ProfileService } from 'merit/core/profile.service';
import { LanguageService } from 'merit/shared/language.service';



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
        BwcService,
        PersistenceService,
        BwcError,
        PlatformService,
        ProfileService,
        LanguageService
    ]
})

export class CoreModule {}