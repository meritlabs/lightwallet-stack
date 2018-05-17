import { Component } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';

@Component({
  selector: 'app-get-started-tips',
  templateUrl: './get-started-tips.component.html',
  styleUrls: ['./get-started-tips.component.sass'],
  animations: [
    trigger('showTips', [
      state('true', style({ maxHeight: '1000px', padding: '30px 20px' })),
      state('false', style({})),
      transition('* => *', animate('300ms ease-out')),
    ]),
  ],
})
export class GetStartedTipsComponent {
  constructor(private persistenceService: PersistenceService2) {}
  active: boolean = false;

  async ngOnInit() {
    const getActiveState = await this.persistenceService.getViewSettings('showStarterTips');

    if (getActiveState !== false) {
      this.active = true;
    }
  }
  async showHide() {
    if (this.active) {
      this.persistenceService.setViewSettings('showStarterTips', false);
      this.active = false;
    } else {
      this.active = true;
    }
  }
}
