import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppSettingsService } from '@merit/common/providers/app-settings.service';
import { ConfigService } from '@merit/common/providers/config.service';
import { ContactsService } from '@merit/common/providers/contacts.service';
import { EasyReceiveService } from '@merit/common/providers/easy-receive.service';
import { LoggerService } from '@merit/common/providers/logger.service';
import { MnemonicService } from '@merit/common/providers/mnemonic.service';
import { MWCService } from '@merit/common/providers/mwc.service';
import { PersistenceService } from '@merit/common/providers/persistence.service';
import { PlatformService } from '@merit/common/providers/platform.service';
import { ProfileService } from '@merit/common/providers/profile.service';
import { RateService } from '@merit/common/providers/rate.service';
import { TxFormatService } from '@merit/common/providers/tx-format.service';
import { UnlockRequestService } from '@merit/common/providers/unlock-request.service';
import { WalletService } from '@merit/common/providers/wallet.service';
import { LanguageService } from '@merit/common/providers/language.service';
import { LedgerService } from '@merit/common/providers/ledger.service';
import { PopupService } from '@merit/common/providers/popup.service';
import { FeeService } from '@merit/common/providers/fee.service';
import { EasySendService } from '@merit/common/providers/easy-send.service';

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
