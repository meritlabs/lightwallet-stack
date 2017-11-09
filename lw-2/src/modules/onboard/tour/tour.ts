import { Component,  ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';


@IonicPage({
  defaultHistory: ['OnboardingPage']
})
@Component({
  selector: 'page-tour',
  templateUrl: 'tour.html',
})
export class TourPage {

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

  toUnlockPage() {
    this.navCtrl.push('UnlockPage');
  }

}
