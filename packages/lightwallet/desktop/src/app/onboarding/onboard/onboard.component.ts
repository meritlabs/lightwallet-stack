import { Component, OnInit } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'view-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.sass']
})
export class OnboardComponent implements OnInit {

  constructor() { }

  public carouselOne: NgxCarousel;
  ngOnInit() {
    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: true
      },
      load: 2,
      touch: true,
      loop: false
    }
  }

}
