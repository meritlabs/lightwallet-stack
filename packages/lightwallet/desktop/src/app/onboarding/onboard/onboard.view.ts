import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'view-onboard',
  templateUrl: './onboard.view.html',
  styleUrls: ['./onboard.view.sass']
})
export class OnboardView implements OnInit {

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

  constructor(
    private router: Router,
    private easyReceiveService: EasyReceiveService
  ) {
  }

  async ngOnInit() {
    const receipts = await this.easyReceiveService.getPendingReceipts();
    if (receipts && receipts[0]) {
      this.router.navigateByUrl('onboarding/unlock');
    }
  }

}
