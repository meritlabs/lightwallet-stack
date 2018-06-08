import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EscrowGuard } from '@merit/desktop/app/market/escrow.guard';
import { MarketLoginView } from '@merit/desktop/app/market/market-login/market-login.view';
import { EscrowPaymentView } from '@merit/desktop/app/market/escrow-payment/escrow-payment.view';

const routes: Routes = [
  { path: '', redirectTo: 'gate', pathMatch: 'full' },
  { path: 'gate', component: MarketLoginView },
  { path: 'escrow', component: EscrowPaymentView, canActivate: [EscrowGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketRoutingModule {}
