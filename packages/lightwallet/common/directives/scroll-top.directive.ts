import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

function getScrollParent(node: HTMLElement) {
  if (node == null) {
    return null;
  }

  if (node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    return getScrollParent(node.parentElement);
  }
}

@Directive({
  selector: '[scrollTop]'
})
export class ScrollTopDirective implements AfterViewInit {
  private nativeElement: HTMLElement;
  private scrollParent: HTMLElement;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.nativeElement = this.el.nativeElement;
  }

  @HostListener('click')
  onClick() {
    if (this.scrollParent = getScrollParent(this.nativeElement)) {
      this.scrollParent.scrollTo(0,0);
    } else {
      console.log('No scrollable parent found!')
    }
  }
}
