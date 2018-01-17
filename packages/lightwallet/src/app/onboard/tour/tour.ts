import { Component, ViewChild } from '@angular/core';
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

  public rateData = { usdPerMerit: null };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private rateService: RateService) {
  }

  ionViewDidLoad() {
    this.rateData.usdPerMerit = this.rateService.fromFiatToMerit(1e8, 'USD');
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

}
