import { Component, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from "rxjs/Subject";

@Component({
  selector: 'add-pool-modal',
  templateUrl: './add-pool-form.component.html',
  styleUrls: ['./add-pool-form.component.sass'],
})
export class AddPoolFormComponent {
  constructor(private formBuilder: FormBuilder) {}

  @Output() @Input() show: boolean;
  @Input() pool: object;

  formData: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(4)] ],
    host: ['', [Validators.required, Validators.pattern( "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$")
    || Validators.pattern("^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$")] ],
    port: ['', [Validators.required, Validators.min(1), Validators.max(49151)] ]
  });

  get title() {
    return this.formData.get('title');
  }

  get host() {
    return this.formData.get('host');
  }

  get port() {
    return this.formData.get('port');
  }

  savePool() : void {
    this.show = false;

    console.log("Saving pool", this.formData)
  }
}