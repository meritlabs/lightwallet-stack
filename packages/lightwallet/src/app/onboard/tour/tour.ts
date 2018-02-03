import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { RateService } from 'merit/transact/rate.service';


@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'view-tour',
  templateUrl: 'tour.html',
})
export class TourView {

  @ViewChild(Slides) slides: Slides;

  rateData: any = {};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private rateService: RateService) {
    this.rateData.usdPerMerit = this.rateService.fromFiatToMerit(1e8, 'USD');
  }

  ionViewDidEnter() {
    this.onSlideWillChange(this.slides);
  }

  slideNext() {
    if (this.slides.getActiveIndex() === 2) {
      this.toUnlockView();
    } else {
      this.slides.slideNext();
    }
  }

  toUnlockView() {
    this.navCtrl.push('UnlockView');
  }

  onSlideWillChange(slides: Slides) {
    switch(slides.getActiveIndex()) {
      case 0:
        slides.lockSwipeToPrev(true);
        slides.lockSwipeToNext(false);
        break;
      case 2:
        slides.lockSwipeToNext(true);
        slides.lockSwipeToPrev(false);
        break;
      default:
        slides.lockSwipeToNext(false);
        slides.lockSwipeToPrev(false);
    }
  }

}
