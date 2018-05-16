import { Component } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-get-started-tips',
  templateUrl: './get-started-tips.component.html',
  styleUrls: ['./get-started-tips.component.sass'],
  animations: [
    trigger('slideInUp', [
      state('true', style({})),
      state('false', style({ maxHeight: 0 })),
      // transition
      transition('* => *', animate('150ms ease-out')),
    ]),
  ],
})
export class GetStartedTipsComponent {
  constructor() {}
  active: boolean = true;
  showHide() {
    if (this.active) this.active = false;
    else this.active = true;
  }
}
