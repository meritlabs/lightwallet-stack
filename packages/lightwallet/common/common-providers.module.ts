import { ModuleWithProviders, NgModule } from '@angular/core';
import { AddressService } from '@merit/common/services/address.service';
import { AlertService } from '@merit/common/services/alert.service';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { ConfigService } from '@merit/common/services/config.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { EmailNotificationsService } from '@merit/common/services/email-notification.service';
import { FeeService } from '@merit/common/services/fee.service';
import { LedgerService } from '@merit/common/services/ledger.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MnemonicService } from '@merit/common/services/mnemonic.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { PopupService } from '@merit/common/services/popup.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { RateService } from '@merit/common/services/rate.service';
import { SendService } from '@merit/common/services/send.service';
import { SmsNotificationsService } from '@merit/common/services/sms-notifications.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { VaultsService } from '@merit/common/services/vaults.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { GoalsService } from '@merit/common/services/goals.service';
import { InviteRequestsService } from '@merit/common/services/invite-request.service';
import { SocialSharing } from '@merit/common/services/social-sharing.service';

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
        EmailNotificationsService,
        SendService,
        FeeService,
        LedgerService,
        LoggerService,
        MnemonicService,
        MWCService,
        PersistenceService,
        PersistenceService2,
        PlatformService,
        PopupService,
        VaultsService,
        ProfileService,
        RateService,
        TxFormatService,
        AddressService,
        InviteRequestsService,
        WalletService,
        AlertService,
        GoalsService,
        SmsNotificationsService,
        SocialSharing
      ]
    };
  }
}
