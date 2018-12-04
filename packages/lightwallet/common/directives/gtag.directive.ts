import { Directive, HostListener, Input } from '@angular/core';

declare const gtag: any;

@Directive({
  selector: '[gtag]',
})
export class GtagDirective {
  @Input()
  gtagEvent: string;
  @Input()
  gtagCategory: string;
  @Input()
  gtagAction: string;
  @Input()
  gtagLabel: string;

  @HostListener('click')
  onClick() {
    if (typeof gtag === 'function') {
      gtag('event', this.gtagEvent, {
        event_category: this.gtagCategory,
        event_action: this.gtagAction,
        event_label: this.gtagLabel,
      });
    }
  }
}
