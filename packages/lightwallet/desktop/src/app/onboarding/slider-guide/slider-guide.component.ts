import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'app-slider-guide',
  templateUrl: './slider-guide.component.html',
  styleUrls: ['./slider-guide.component.sass'],
})
export class SliderGuideComponent {
  carouselOne: NgxCarousel = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 400,
    interval: 4000,
    point: {
      visible: true,
    },
    load: 2,
    touch: true,
    loop: false,
  };

  @Output()
  hideGuide = new EventEmitter<Boolean>();
  @Input()
  skipButton: string = 'Skip tutorial';
  @Input()
  primaryButton: string = 'Get started';

  skipIntro() {
    this.hideGuide.emit(false);
  }
}
