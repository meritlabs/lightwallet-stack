import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IPool } from "@merit/desktop/app/core/components/select-pool/select-pool.component";
import { PersistenceService2 } from "@merit/common/services/persistence2.service";
import { CheckIfHost } from "@merit/desktop/app/core/components/add-pool-form/add-pool-form.validators";

export enum PoolFormAction {
  CREATE = "create",
  EDIT = "edit",
}

@Component({
  selector: "add-pool-modal",
  templateUrl: "./add-pool-form.component.html",
  styleUrls: ["./add-pool-form.component.sass"]
})
export class AddPoolFormComponent implements OnChanges {
  @Input() show : boolean;
  @Input() pool : IPool;

  @Output() onSave = new EventEmitter<IPool[]>();
  @Output() onClose = new EventEmitter<void>();

  action: PoolFormAction = PoolFormAction.CREATE;

  formData: FormGroup = this.formBuilder.group({
    title: ["", [Validators.required, Validators.minLength(4)]],
    host: ["", [Validators.required, CheckIfHost]],
    port: ["", [Validators.required, Validators.min(1), Validators.max(49151)]]
  });

  constructor(private formBuilder: FormBuilder,
              private persistenceService: PersistenceService2
  ) {}

  ngOnChanges(changes) {
    if (changes.pool) {
      if(this.pool == undefined){
        this.clearData();
        this.action = PoolFormAction.CREATE;
      }

      if(this.pool != undefined && this.pool){
        this.action = PoolFormAction.EDIT;

        this.formData.patchValue({
          title: this.pool.name,
          host: this.pool.website,
          port: this.pool.url.substring(this.pool.url.lastIndexOf(":") + 1)
        });

      }
    }
  }

  get title() {
    return this.formData.get("title");
  }

  get host() {
    return this.formData.get("host");
  }

  get port() {
    return this.formData.get("port");
  }

  async savePool() {
    let pool: IPool = {
      name: this.title.value,
      website: this.host.value,
      url: "stratum+tcp://" + this.host.value + ":" + this.port.value,
      editable: true,
      removable: true
    };

    let allPools : IPool[];

    if(this.action == PoolFormAction.EDIT){
      allPools = await this.persistenceService.getAvailablePools();
      for(let i = 0; i < allPools.length; i++){
        if(allPools[i].url == this.pool.url){
          allPools[i].name = this.title.value;
          allPools[i].website = this.host.value;
          allPools[i].url = "stratum+tcp://" + this.host.value + ":" + this.port.value
        }
      }
      await this.persistenceService.setAvailablePools(allPools);

      this.action = PoolFormAction.CREATE;
    } else { // CREATE
      await this.persistenceService.addNewPool(pool);
      allPools = await this.persistenceService.getAvailablePools();
    }

    this.clearData();
    this.onSave.emit(allPools);
  }

  clearData(): void {
    this.formData.reset();
  }

  closeModal() : void {
    this.onClose.emit();
    this.clearData();
  }
}
