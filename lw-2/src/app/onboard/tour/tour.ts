import { Component,  ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';


@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'page-tour',
  templateUrl: 'tour.html',
})
export class TourView {

  @ViewChild(Slides) slides: Slides;
  public currentIndex: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

  slideNext() {
    this.slides.slideNext();
    this.currentIndex = this.slides.getActiveIndex();
  }

  toUnlockView() {
    this.navCtrl.push('UnlockView');
  }

}
