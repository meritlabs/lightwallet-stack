import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'merit-pagination',
  template: `
    <nav class="main-container" *ngIf="numberOfPages > 1">
      <a class="item" (click)="selectPage(1)" *ngIf="pages[0] !== 1" [class.active]="value === 1">1</a>
      <a class="item disabled" *ngIf="numberOfPages > 10 && value > 5">...</a>
      <a class="item" *ngFor="let page of pages" (click)="selectPage(page)" [class.active]="value === page">{{page}}</a>
      <a class="item disabled" *ngIf="numberOfPages > 10 && value < numberOfPages - 5">...</a>
      <a class="item" (click)="selectPage(numberOfPages)" [class.active]="value === numberOfPages">{{numberOfPages}}</a>
    </nav>
  `,
  styleUrls: ['./pagination.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => PaginationComponent),
    },
  ],
})
export class PaginationComponent implements OnChanges, ControlValueAccessor {

  @Input()
  total: number;

  @Input()
  limit: number;

  @Output() totalPages: EventEmitter<number> = new EventEmitter<number>();

  numberOfPages: number;
  pages: number[] = [];
  value: number = 1;
  onChange: Function = () => {
  };
  onTouched: Function = () => {
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['total'] || changes['limit']) {
      this.updatePages();
    }
  }

  updatePages(): void {
    this.numberOfPages = Math.ceil(this.total / this.limit);
    const pages = [];
    if (this.numberOfPages > 9) {
      let start = this.value > 5 ? this.value - 2 : this.value - 3;
      start = Math.max(1, Math.min(start, start + 5));

      for (let x = 0; x < 6 && start + x < this.numberOfPages; x++) {
        pages.push(start + x);
      }

      const x: number = start + 7,
        y: number = this.value + 5;

      if ((x == this.numberOfPages) && (y == this.numberOfPages)) {
        pages.push(start + 6);
      }

    } else {
      for (let x = 1; x <= this.numberOfPages; x++) {
        if (x !== 1 && x !== this.numberOfPages) {
          pages.push(x);
        }
      }
    }

    this.pages = pages;
  }

  selectPage(page: number): void {
    if (page === this.value) return;
    this.value = page;
    this.writeValue(page);
  }

  writeValue(value: number, local?: boolean): void {
    this.onChange(this.value = Number(value));
    this.updatePages();
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
