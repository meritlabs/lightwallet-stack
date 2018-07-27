import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IPool } from "@merit/desktop/app/core/components/select-pool/select-pool.component";
import { PersistenceService2 } from "@merit/common/services/persistence2.service";

@Component({
  selector: "add-pool-modal",
  templateUrl: "./add-pool-form.component.html",
  styleUrls: ["./add-pool-form.component.sass"]
})
export class AddPoolFormComponent {
  @Input() show: boolean;
  @Input() pool: object;

  @Output() onSave = new EventEmitter<IPool[]>();
  @Output() onClose = new EventEmitter<void>();

  formData: FormGroup = this.formBuilder.group({
    title: ["", [Validators.required, Validators.minLength(4)]],
    // TODO: fix host regexp
    host: ["", [Validators.required, Validators.pattern("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$")
    || Validators.pattern("^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$")]],
    port: ["", [Validators.required, Validators.min(1), Validators.max(49151)]]
  });

  constructor(private formBuilder: FormBuilder,
              private persistenceService: PersistenceService2
  ) {}

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

    await this.persistenceService.addNewPool(pool);
    let allPools = await this.persistenceService.getAvailablePools();

    this.clearData();
    this.onSave.emit(allPools);
  }


  clearData(): void {
    this.formData.reset();
  }
}