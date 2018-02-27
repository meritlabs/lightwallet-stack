import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { ConfigService } from '@merit/common/services/config.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MnemonicService } from '@merit/common/services/mnemonic.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { RateService } from '@merit/common/services/rate.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { UnlockRequestService } from '@merit/common/services/unlock-request.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { LanguageService } from '@merit/common/services/language.service';
import { LedgerService } from '@merit/common/services/ledger.service';
import { PopupService } from '@merit/common/services/popup.service';
import { FeeService } from '@merit/common/services/fee.service';
import { EasySendService } from '@merit/common/services/easy-send.service';

@NgModule()
export class CommonProvidersModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonProvidersModule,
      providers: [
        AppSettingsService,
        ConfigService,
        ContactsService,
        EasyReceiveService,
        EasySendService,
        FeeService,
        LanguageService,
        LedgerService,
        LoggerService,
        MnemonicService,
        MWCService,
        PersistenceService,
        PlatformService,
        PopupService,
        ProfileService,
        RateService,
        TxFormatService,
        UnlockRequestService,
        WalletService
      ]
    };
  }
}
