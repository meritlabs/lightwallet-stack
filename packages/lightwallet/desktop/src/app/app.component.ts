import { Component, Renderer2, ViewEncapsulation } from '@angular/core';
import { DOMController } from '@merit/desktop/app/components/dom.controller';

@Component({
  selector: 'merit-lw',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(private domCtrl: DOMController,
              private renderer2: Renderer2) {
    // Services can't inject Renderer, so this is a workaround.
    domCtrl.rnd = renderer2;
  }
}
