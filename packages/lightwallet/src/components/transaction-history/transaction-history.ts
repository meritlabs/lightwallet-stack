import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ITransaction } from '../../models/transaction';
import { ContactsProvider } from '../../providers/contacts/contacts';

@Component({
  selector: 'transaction-history',
  templateUrl: 'transaction-history.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionHistoryComponent {
  _transactions: ITransaction[];

  @Input()
  set transactions(transactions: ITransaction[]) {
    this._transactions = transactions.map((transaction: ITransaction) => {

      return transaction;
    });
  }

  get transactions() {
    return this._transactions;
  }

  constructor(private contactsService: ContactsProvider) {}
}
