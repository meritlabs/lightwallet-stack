import { NgModule } from '@angular/core';
import { PaginationComponent } from '@merit/desktop/app/core/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [PaginationComponent],
  exports: [PaginationComponent],
})
export class PaginationModule {
}
