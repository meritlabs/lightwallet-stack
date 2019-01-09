import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[custom-header-color]',
})
export class CustomHeaderColorDirective implements AfterViewInit {
  private toolbarBackgroundNativeElement: HTMLElement;

  _color: string;

  @Input('custom-header-color')
  set color(color: string) {
    if (this._color !== color) {
      this._color = color;
      this.applyColor();
    }
  }

  get color(): string {
    return this._color;
  }

  constructor(private rnd: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    this.toolbarBackgroundNativeElement = this.el.nativeElement.querySelector('.toolbar-background');
    this.applyColor();
  }

  private applyColor() {
    if (this.toolbarBackgroundNativeElement) {
      this.rnd.setStyle(this.toolbarBackgroundNativeElement, 'background', this.color);
    }
  }
}
