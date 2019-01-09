import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-start-up',
  templateUrl: './app-start-up.component.html',
  styleUrls: ['./app-start-up.component.sass'],
})
export class AppStartUpComponent implements OnInit {
  showWelcomeAnimation: Boolean = true;

  ngOnInit() {
    let showWelcomeAnimation;
    if ('showWelcomeAnimation' in localStorage && localStorage.getItem('showWelcomeAnimation') === 'false') {
      showWelcomeAnimation = false;
    } else {
      localStorage.setItem('showWelcomeAnimation', 'false');
      showWelcomeAnimation = true;
    }
    this.showWelcomeAnimation = showWelcomeAnimation;
  }
}
