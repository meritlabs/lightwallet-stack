import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.sass']
})
export class GuideComponent {

  carouselOne: NgxCarousel = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 400,
    interval: 4000,
    point: {
      visible: true
    },
    load: 2,
    touch: true,
    loop: false
  };
  @Output() hideGuide = new EventEmitter<Boolean>();
  @Input() showGuide: any;
  skipIntro() {
    this.hideGuide.emit(false);
  }
}
