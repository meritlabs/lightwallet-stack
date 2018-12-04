import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { SharedComponentsModule } from '@merit/desktop/app/components/shared-components.module';
import { MarketRoutingModule } from '@merit/desktop/app/market/market-routing.module';
import { EscrowGuard } from '@merit/desktop/app/market/escrow.guard';
import { MarketLoginView } from '@merit/desktop/app/market/market-login/market-login.view';
import { EscrowPaymentView } from '@merit/desktop/app/market/escrow-payment/escrow-payment.view';
import { WalletService } from '@merit/common/services/wallet.service';
import { SendService } from '@merit/common/services/send.service';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    MarketRoutingModule,
    Ng4LoadingSpinnerModule,
    SharedComponentsModule.forRoot(),
    CommonPipesModule,
  ],
  declarations: [MarketLoginView, EscrowPaymentView],
  providers: [EscrowGuard, WalletService, SendService],
})
export class MarketModule {}
