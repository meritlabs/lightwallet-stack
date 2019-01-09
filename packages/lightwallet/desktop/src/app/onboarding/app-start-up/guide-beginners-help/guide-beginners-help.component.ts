import { Component } from '@angular/core';

@Component({
  selector: 'app-guide-beginners-help',
  templateUrl: './guide-beginners-help.component.html',
  styleUrls: ['./guide-beginners-help.component.sass'],
})
export class GuideBeginnersHelpComponent {
  showGuide: boolean = !('showGuide' in localStorage && localStorage.getItem('showGuide') === 'false');

  hideGuide() {
    this.showGuide = false;
    localStorage.setItem('showGuide', 'false');
  }
}
