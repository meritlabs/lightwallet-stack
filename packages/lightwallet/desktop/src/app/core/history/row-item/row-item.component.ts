import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-row-item',
  templateUrl: './row-item.component.html',
  styleUrls: ['./row-item.component.sass']
})
export class RowItemComponent implements OnInit {
  @Input() item: any;
  @Input() expande: Boolean;

  constructor() {}
  @Output() expandEv = new EventEmitter<boolean>();
  expandThis(value) {
this.expandEv.emit(true);
    if(this.expande === false) {

      this.expande = true;
      this.expandEv.emit(false);
    }else{
      this.expande = false;
    }

    // if(show === false) {
    //   this.show = true;
    // }else{
    //   this.show = false;
    // }


  }
  ngOnInit() {}
}
