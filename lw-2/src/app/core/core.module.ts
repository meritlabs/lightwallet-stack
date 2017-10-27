import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Logger } from "./logger";
import { BwcService } from 'merit/core/bwc.service';
import { PersistenceService } from 'merit/core/persistence.service';
import { BwcError } from 'merit/core/bwc-error.model';
import { PlatformService } from 'merit/core/platform.service';
import { ProfileService } from 'merit/core/profile.service';
import { LanguageService } from 'merit/shared/language.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { AppService } from 'merit/core/app-settings.service';
import { ConfigService } from 'merit/shared/config.service';
import { TransactModule } from 'merit/transact/transact.module';





import { MomentModule } from 'angular2-moment';

/* 
  The core module exists to make commonly used singleton services available 
  for use in other modules.  
  The goal, over time, is to make this module leaner and tighter as we continue
  to evolve the application.
*/
@NgModule({
    imports: [
        CommonModule,
        TransactModule, // Ideally, we can remove this dependency.
        HttpModule        
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
        LanguageService,
        TxFormatService,
        AppService,
        ConfigService
    ]
})

export class CoreModule {}