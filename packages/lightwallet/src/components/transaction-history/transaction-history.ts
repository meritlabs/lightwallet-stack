import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ITransaction } from '../../models/transaction';

@Component({
  selector: 'transaction-history',
  templateUrl: 'transaction-history.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionHistoryComponent {
  @Input()
  transactions: ITransaction[];
}
