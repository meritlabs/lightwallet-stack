import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PhraseImportView } from '@merit/desktop/app/import/phrase-import/phrase-import.view';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PhraseImportView,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class PhraseImportRoutingModule {}

@NgModule({
  entryComponents: [PhraseImportView],
  declarations: [PhraseImportView],
  imports: [PhraseImportRoutingModule, FormsModule, ReactiveFormsModule, Ng4LoadingSpinnerModule],
})
export class PhraseImportModule {}
