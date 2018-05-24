import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.sass'],
})
export class QuestsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  step: number = 0;
  nextStep(step) {
    this.step = step;
  }
}
