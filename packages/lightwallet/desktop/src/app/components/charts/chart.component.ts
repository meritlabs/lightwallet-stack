import { Component, Input} from "@angular/core";
import { Store } from "@ngrx/store";

import { GpuAddDatasetsAction, GpuAddStatAction, IGPUStat, IGPUStatDataset } from "@merit/common/reducers/gpustats.reducer";
import { BaseGpuWidget } from "@merit/desktop/app/components/charts/base-gpu-widget.component";
import { IRootAppState } from "@merit/common/reducers";


@Component({
  selector: "chart",
  templateUrl: "./base-gpu-widget.component.html",
  styleUrls: ["./base-gpu-widget.component.sass"]
})
export class ChartComponent extends BaseGpuWidget {
  @Input() getData: Function;
  @Input() getLabels: Function;

  constructor(protected store: Store<IRootAppState>) {
    super();
  }

  protected updateData(): void {
    let data = this.getData();
    let labels = this.getLabels();

    // Initializing dataset for each GPU
    if (!this.datasets || this.datasets == undefined || this.datasets.length == 0) {
      let ds: IGPUStatDataset[] = [];
      ds.length = data.length;

      for (let i = 0; i < data.length; i++) {
        ds[i] = {
          data: [],
          label: labels[i],
          borderColor: (this.borderColors[i]) ? this.borderColors[i] : "#00b0dd",
          borderWidth: 2,
          pointRadius: 0
        };
      }

      this.datasets = ds;
      this.store.dispatch(new GpuAddDatasetsAction(this.slug, ds));
    }

    // Push data
    let dataToPush: IGPUStat[] = [];
    for (let i = 0; i < this.datasets.length; i++) {
      let item = { t: new Date(), y: data[i]};
      this.datasets[i].data.push(item);
      dataToPush.push(item);
    }

    this.store.dispatch(new GpuAddStatAction(this.slug, dataToPush, this.dataLimit));

    this.chart.data.datasets = this.datasets;
    this.chart.update();

    this.updateTimer = setTimeout(this.updateData.bind(this), this.updateInterval);
  }


}
