import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { IHistoryFilters } from '@merit/common/models/transaction';

@IonicPage()
@Component({
  selector: 'history-filters-modal',
  templateUrl: './history-filters.html',
})
export class HistoryFiltersModal {
  filters: IHistoryFilters = this.navParams.get('filters');

  constructor(private viewCtrl: ViewController,
              private navParams: NavParams) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
