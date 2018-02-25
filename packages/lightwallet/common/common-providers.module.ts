import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppSettingsService } from '@merit/common/providers/app-settings';
import { ConfigService } from '@merit/common/providers/config';
import { ContactsService } from '@merit/common/providers/contacts';
import { EasyReceiveService } from '@merit/common/providers/easy-receive';
import { LoggerService } from '@merit/common/providers/logger';
import { MnemonicService } from '@merit/common/providers/mnemonic';
import { MWCService } from '@merit/common/providers/mwc';
import { PersistenceService } from '@merit/common/providers/persistence';
import { PlatformService } from '@merit/common/providers/platform';
import { ProfileService } from '@merit/common/providers/profile';
import { RateService } from '@merit/common/providers/rate';
import { TxFormatService } from '@merit/common/providers/tx-format';
import { UnlockRequestService } from '@merit/common/providers/unlock-request';
import { WalletService } from '@merit/common/providers/wallet';

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
        LoggerService,
        MnemonicService,
        MWCService,
        PersistenceService,
        PlatformService,
        ProfileService,
        RateService,
        TxFormatService,
        UnlockRequestService,
        WalletService
      ]
    };
  }
}
