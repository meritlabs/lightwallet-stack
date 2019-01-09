import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'send-tour',
  templateUrl: './send-tour.component.html',
  styleUrls: ['./send-tour.component.sass'],
})
export class SendTourComponent {
  @Output()
  hideTour = new EventEmitter<Boolean>();
  step: number = 0;

  stepGoTo(i?: number) {
    if (typeof i === 'number') {
      this.step = i;
    } else {
      if (this.step === 3) {
        this.hideTour.emit(false);
      } else {
        this.step += 1;
      }
    }
  }

  skipIntro() {
    this.hideTour.emit(false);
  }
}
