import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'view-select-color',
  templateUrl: 'select-color.html',
})
export class SelectColorView {

  public availableColors = [
    { hex: '#dd4b39', name: 'Cinnabar' },
    { hex: '#f38f12', name: 'Carrot Orange' },
    { hex: '#faa77f', name: 'Light Salmon' },
    { hex: '#d0b136', name: 'Metallic Gold' },
    { hex: '#9edd72', name: 'Feijoa' },
    { hex: '#29bb9c', name: 'Shamrock' },
    { hex: '#019477', name: 'Observatory' },
    { hex: '#77dada', name: 'Turquoise Blue' },
    { hex: '#4a90e2', name: 'Cornflower Blue' },
    { hex: '#484ed3', name: 'Free Speech Blue' },
    { hex: '#9b59b6', name: 'Deep Lilac' },
    { hex: '#e856ef', name: 'Free Speech Magenta' },
    { hex: '#ff599e', name: 'Brilliant Rose' },
    { hex: '#7a8c9e', name: 'Light Slate Grey' },
    { hex: '#30afe6', name: 'Merit' }
  ]

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController) {

  }

  ionViewDidLoad() {
    //do something here
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(color) {
    this.viewCtrl.dismiss(color.hex);
  }

}
