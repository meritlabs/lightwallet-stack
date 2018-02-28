import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.sass']
})
export class SelectComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @Output() messageEvent = new EventEmitter<string>();
  @Input() selected: any;
  @Input() input: any;
  @Input() style: any;
  show: boolean = false;
  select(item) {
    this.show = false;
    this.messageEvent.emit(item)
  }
}
