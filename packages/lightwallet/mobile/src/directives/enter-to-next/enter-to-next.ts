import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';

@Directive({
  selector: '[enter-to-next]',
})
export class EnterToNextDirective implements AfterViewInit {
  constructor(private plt: Platform, private el: ElementRef) {}

  ngAfterViewInit() {
    const inputNodes: NodeListOf<any> = this.el.nativeElement.querySelectorAll('input,textarea');
    const inputs = [];
    let i = 0;

    for (i; i < inputNodes.length; i++) inputs.push(inputNodes[i]);

    (this.el.nativeElement as HTMLElement).onkeyup = (event: KeyboardEvent) => {
      const { keyCode, target } = event;
      if (keyCode === 13 && (target as HTMLInputElement).tagName === 'INPUT') {
        let index;
        const input = inputs.find((i, ii) => {
          if (target == i) {
            index = ii;
            return true;
          }
        });

        if (input) {
          if (index !== inputs.length - 1) inputs[index + 1].focus();
          else input.blur();
        }
      }
    };
  }
}
