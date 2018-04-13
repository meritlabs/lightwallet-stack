import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'send-tour',
  templateUrl: './send-tour.component.html',
  styleUrls: ['./send-tour.component.sass']
})
export class SendTourComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @Output() hideTour = new EventEmitter<Boolean>();
  @Input() showTour: any;
  step: number = 0;

  stepGoTo(i) {
    if(i || i === 0) {
      this.step = i;
    }else {
      if(this.step === 3) {
        this.hideTour.emit(false);
      }else {
        this.step += 1;
      }
    }
  }
  skipIntro() {
    this.hideTour.emit(false);
  }

}
