import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface IHistoryFilters {
  growth_reward: boolean;
  mining_reward: boolean;
  sent: boolean;
  received: boolean;
  meritmoney: boolean;
  meritinvite: boolean;
  market: boolean;
  pool_reward: boolean;
  invite: boolean;
}

@Component({
  selector: 'history-filters',
  template: `
    <ng-container *ngIf="filters">
      <div class="filter-option" [class.active]="filters.mining_reward"
           (click)="updateFilter('mining_reward', !filters.mining_reward)">Mining Rewards
      </div>
      <div class="filter-option" [class.active]="filters.growth_reward"
           (click)="updateFilter('growth_reward', !filters.growth_reward)">Growth Rewards
      </div>
      <div class="filter-option" [class.active]="filters.pool_reward"
           (click)="updateFilter('pool_reward', !filters.pool_reward)">Pool
      </div>
      <div class="filter-option" [class.active]="filters.market" (click)="updateFilter('market', !filters.market)">
        Market
      </div>
      <div class="filter-option" [class.active]="filters.invite" (click)="updateFilter('invite', !filters.invite)">INV
      </div>
      <div class="filter-option" [class.active]="filters.received"
           (click)="updateFilter('received', !filters.received)">MRT Received
      </div>
      <div class="filter-option" [class.active]="filters.sent" (click)="updateFilter('sent', !filters.sent)">MRT Sent
      </div>
      <div class="filter-option" [class.active]="filters.meritmoney"
           (click)="updateFilter('meritmoney', !filters.meritmoney)">MeritMoney
      </div>
      <div class="filter-option" [class.active]="filters.meritinvite"
           (click)="updateFilter('meritinvite', !filters.meritinvite)">MeritInvite
      </div>
    </ng-container>
  `,
  styleUrls: ['./history-filters.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HistoryFiltersComponent),
    },
  ],
})
export class HistoryFiltersComponent implements ControlValueAccessor {
  filters: IHistoryFilters;
  onChange: Function = () => {
  };
  onTouched: Function = () => {
  };

  writeValue(value: IHistoryFilters): void {
    this.onChange(this.filters = value);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  updateFilter(filter: keyof IHistoryFilters, value: boolean) {
    this.writeValue({
      ...this.filters,
      [filter]: value,
    });
  }
}
