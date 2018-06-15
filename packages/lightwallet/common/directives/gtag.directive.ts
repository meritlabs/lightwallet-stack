import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appGtag]',
})
export class GtagDirective {
  @Input() gtagEvent: string;
  @Input() gtagCategory: string;
  @Input() gtagAction: string;
  @Input() gtagLabel: string;

  constructor() {}

  @HostListener('click')
  onClick() {
    console.log(this.gtagEvent);
  }
}
