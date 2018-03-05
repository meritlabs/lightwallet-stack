import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.sass']
})
export class PersonalComponent implements OnInit {
  @Input() showButton: boolean;
  constructor() { }
  ngOnInit() {}
}
