import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Platform } from 'ionic-angular';
import { PanGesture } from './pan-gesture';

@Component({
  selector: 'slide-to-action',
  templateUrl: 'slide-to-action.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideToActionComponent implements AfterViewInit, OnDestroy {
  private _gesture: PanGesture;
  private _sliderPosition: number = 0;

  @ViewChild('slider')
  _sliderElement: ElementRef;
  _sliderNativeElement: HTMLElement;

  @ViewChild('container')
  _containerElement: ElementRef;

  @Input()
  text: string = 'Slide to confirm';
  @Input()
  disabled: boolean;

  @Output()
  confirm: EventEmitter<void> = new EventEmitter<void>();

  constructor(private _plt: Platform, private _rnd: Renderer2) {}

  ngAfterViewInit() {
    this._sliderNativeElement = this._sliderElement.nativeElement;
    const containerWidth = this._containerElement.nativeElement.offsetWidth;
    const sliderWidth = this._sliderNativeElement.offsetWidth;

    // max position = container width - slider width - (8px * 2) margin
    const maxPosition = containerWidth - sliderWidth - 16;

    this._gesture = new PanGesture(this._plt, this._sliderElement.nativeElement, this._rnd);
    this._gesture.onMove = (delta: number) => {
      if (this.disabled) return;
      const newPos = Math.min(Math.max(0, -1 * delta + this._sliderPosition), maxPosition);
      if (newPos !== this._sliderPosition) {
        // if (newPos === maxPosition) {
        // TODO use haptic/taptic feedback
        // }
        this._sliderPosition = newPos;
        this.moveSlider(0);
      }
    };

    this._gesture.onEnd = () => {
      if (this.disabled) return;
      switch (this._sliderPosition) {
        case 0:
          return;
        case maxPosition:
          this.confirm.emit();
          break;
      }

      this._sliderPosition = 0;
      this.moveSlider();
    };
  }

  ngOnDestroy() {
    this._gesture && this._gesture.destroy();
  }

  moveSlider(duration: number = 300) {
    if (this.disabled) return;
    this._plt.raf(() => {
      if (duration) {
        this._rnd.setStyle(this._sliderNativeElement, this._plt.Css.transition, `all ${duration}ms ease-out`);
        this._plt.timeout(() => {
          this._rnd.setStyle(this._sliderNativeElement, this._plt.Css.transition, '');
        }, duration);
      }
      this._rnd.setStyle(
        this._sliderNativeElement,
        this._plt.Css.transform,
        `translate3d(${this._sliderPosition}px, 0, 0)`,
      );
    });
  }
}
