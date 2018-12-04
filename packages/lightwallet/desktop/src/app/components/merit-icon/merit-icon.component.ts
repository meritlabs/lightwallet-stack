import { Component, Input } from '@angular/core';

@Component({
  selector: 'merit-icon',
  template: '',
  styleUrls: ['./merit-icon.component.sass'],
  host: {
    '[class]': 'name',
  },
})
export class MeritIconComponent {
  @Input()
  name: string;
}
