import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.sass'],
  host: {
    '[class.disabled]': 'input.length === 0'
  }
})
export class SelectComponent {

  @Output() selectionEvent = new EventEmitter<string>();
  @Input() selected: any;
  @Input() input: any;
  @Input() cssClass: any;
  show: boolean = false;

  select(item) {
    this.show = false;
    this.selectionEvent.emit(item);
  }

  onBlur() {
    setTimeout(() => {
      this.show = false;
    }, 200);
  }
}
