import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.sass']
})
export class LockScreenComponent {
  @Input() fullScreen: boolean = false;
}
