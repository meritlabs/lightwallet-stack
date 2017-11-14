import { Component,  ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import {RateService} from "merit/transact/rate.service";


@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'view-tour',
  templateUrl: 'tour.html',
})
export class TourView {

  @ViewChild(Slides) slides: Slides;
  public currentIndex: number;

  public rateData = {usdPerMerit:null};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private rateService:RateService
  ) {

  }

  ionViewDidLoad() {
    this.rateData.usdPerMerit = this.rateService.fromFiat(1e8, 'USD');
  }

  slideNext() {
    this.slides.slideNext();
    this.currentIndex = this.slides.getActiveIndex();
  }

  toUnlockView() {
    this.navCtrl.push('UnlockView');
  }

}
