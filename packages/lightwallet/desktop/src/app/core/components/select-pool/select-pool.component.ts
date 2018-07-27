import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PersistenceService2 } from "@merit/common/services/persistence2.service";

export interface IPool {
  name: string;
  website: string;
  url: string;
  editable: boolean;
  removable: boolean;
}

@Component({
  selector: 'app-select-pool',
  templateUrl: './select-pool.component.html',
  styleUrls: ['./select-pool.component.sass']
})
export class SelectPoolComponent implements OnInit {
  @Output() selectionEvent = new EventEmitter<string>();
  @Input() selected: any;
  @Input() cssClass: any;
  show: boolean = false;
  showModal: boolean = false;
  private input: IPool[];

  constructor(private persistenceService: PersistenceService2){
  }

  async ngOnInit(){
    this.input = await this.persistenceService.getAvailablePools();
  }

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

  deletePool(pool : IPool){
    this.input = this.input.filter((item : IPool) => item.name != pool.name || item.url != pool.url || item.website != pool.website);

    this.persistenceService.setAvailablePools(this.input);
  }

  saved($event) : void {
    console.log("saved($event)", $event);

    this.close();

    this.input = $event;
  }

  close() : void {
    console.log("closing!");
    this.showModal = false;
  }
}
