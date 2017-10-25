import { Component,  ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';


@IonicPage({
  defaultHistory: ['OnboardingComponent']
})
@Component({
  selector: 'component-tour',
  templateUrl: 'tour.html',
})
export class TourComponent {

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

  toUnlockComponent() {
    this.navCtrl.push('UnlockComponent');
  }

}
