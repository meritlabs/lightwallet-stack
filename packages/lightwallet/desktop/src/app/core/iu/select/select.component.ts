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
  @Output() selectionEvent = new EventEmitter<string>();
  @Input() selected: any;
  @Input() input: any;
  @Input() style: any;
  show: boolean = false;
  select(item) {
    this.show = false;
    this.selectionEvent.emit(item)
  }
  onBlur() {
    let _this = this;
    setTimeout(function() {
      _this.show = false;
    },200)
  }
}
