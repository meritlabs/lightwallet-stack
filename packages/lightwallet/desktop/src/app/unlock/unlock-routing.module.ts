import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnlockComponent } from './unlock/unlock.component';

const routes: Routes = [
  { path: '', component: UnlockComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnlockRoutingModule { }
