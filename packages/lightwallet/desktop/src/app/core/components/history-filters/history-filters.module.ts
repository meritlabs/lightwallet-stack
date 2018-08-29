import { NgModule } from '@angular/core';
import { HistoryFiltersComponent } from '@merit/desktop/app/core/components/history-filters/history-filters.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [HistoryFiltersComponent],
  exports: [HistoryFiltersComponent]
})
export class HistoryFiltersModule {}
