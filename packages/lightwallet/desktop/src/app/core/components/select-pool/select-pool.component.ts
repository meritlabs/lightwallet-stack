import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select-pool',
  templateUrl: './select-pool.component.html',
  styleUrls: ['./select-pool.component.sass']
})
export class SelectPoolComponent {

  @Output() selectionEvent = new EventEmitter<string>();
  @Input() selected: any;
  @Input() input: any;
  @Input() cssClass: any;
  show: boolean = false;
  showModal: boolean = false;

  select(item) {
    this.show = false;
    this.selectionEvent.emit(item);
  }

  onBlur() {
    setTimeout(() => {
      this.show = false;
    }, 200);
  }

  addNewPool() : void {
    this.showModal = true;
  }
}
