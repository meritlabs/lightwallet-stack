import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'view-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  amount: number = null;
  constructor() { }
  ngOnInit() {}
  sendSubmit($event) {
    if($event.keyCode === 13) {
      let element: HTMLElement = document.getElementById('sendMrt') as HTMLElement;
      element.click();
    }
  }
}
