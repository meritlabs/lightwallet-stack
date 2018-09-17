import { Directive } from '@angular/core';

@Directive({
  selector: '[blurOnClick]',
  host: {
    '(click)': 'onClick($event)',
  },
})
export class BlurOnClickDirective {
  onClick(ev: any) {
    try {
      ev.target.blur();
    } catch (err) {
    }
  }
}
