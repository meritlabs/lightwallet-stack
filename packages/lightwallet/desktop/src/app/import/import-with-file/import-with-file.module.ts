import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImportWithFileView } from '@merit/desktop/app/import/import-with-file/import-with-file.view';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ImportWithFileView,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ImportWithFileRoutingModule {}

@NgModule({
  entryComponents: [ImportWithFileView],
  declarations: [ImportWithFileView],
  imports: [ImportWithFileRoutingModule, FormsModule, ReactiveFormsModule, Ng4LoadingSpinnerModule],
})
export class ImportWithFileModule {}
