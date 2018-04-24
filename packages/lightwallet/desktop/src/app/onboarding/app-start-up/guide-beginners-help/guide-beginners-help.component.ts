import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guide-beginners-help',
  templateUrl: './guide-beginners-help.component.html',
  styleUrls: ['./guide-beginners-help.component.sass']
})
export class GuideBeginnersHelpComponent implements OnInit {

  showGuide: boolean;

  async ngOnInit() {
    let showGuide;
    if("showGuide" in localStorage && localStorage.getItem("showGuide") === 'false') {
      showGuide = false;
    }else {
      showGuide  = true;
    }
    this.showGuide = showGuide;
  }
  hideGuide($event) {
    this.showGuide = $event;
    localStorage.setItem("showGuide", $event);
  }

}
