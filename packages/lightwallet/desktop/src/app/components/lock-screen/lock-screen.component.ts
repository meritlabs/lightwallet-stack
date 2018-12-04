import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.sass'],
})
export class LockScreenComponent {
  private _fullScreen: boolean;

  @Input()
  set fullScreen(val: any) {
    this._fullScreen = val ? Boolean(val) : true;
  }

  get fullScreen() {
    return this._fullScreen;
  }
}
