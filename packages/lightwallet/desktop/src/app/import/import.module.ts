import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportWalletView } from '@merit/desktop/app/import/import-wallet.view';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ImportWalletView,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ImportRoutingModule {}

@NgModule({
  entryComponents: [ImportWalletView],
  declarations: [ImportWalletView],
  imports: [ImportRoutingModule],
})
export class ImportModule {}
