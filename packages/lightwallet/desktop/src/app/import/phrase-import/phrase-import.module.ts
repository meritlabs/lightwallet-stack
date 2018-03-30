import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PhraseImportView } from '@merit/desktop/app/import/phrase-import/phrase-import.view';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PhraseImportView
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PhraseImportRoutingModule {}

@NgModule({
  entryComponents: [PhraseImportView],
  declarations: [PhraseImportView],
  imports: [
    PhraseImportRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PhraseImportModule {}
