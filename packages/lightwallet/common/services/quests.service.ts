import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { Quests, Quest } from '@merit/common/models/quest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { LoadQuestsAction } from '@merit/common/reducers/quests.reducer';

@Injectable()
export class QuestsService {
  static BASE_URL: string = 'https://testnet.mws.merit.me/achivement-engine/api/v1/goals/';

  constructor(private http: HttpClient, private store: Store<IRootAppState>) {}

  loadQuests(): void {
    this.http
      .get(QuestsService.BASE_URL)
      .toPromise()
      .then((quests: Quest[]) => {
        this.store.dispatch(new LoadQuestsAction(quests));
      });
  }
}
