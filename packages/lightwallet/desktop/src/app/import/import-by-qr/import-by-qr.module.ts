import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportByQrView } from '@merit/desktop/app/import/import-by-qr/import-by-qr.view';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ImportByQrView,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ImportByQrRoutingModule {}

@NgModule({
  entryComponents: [ImportByQrView],
  declarations: [ImportByQrView],
  imports: [ImportByQrRoutingModule],
})
export class ImportByQrModule {}
