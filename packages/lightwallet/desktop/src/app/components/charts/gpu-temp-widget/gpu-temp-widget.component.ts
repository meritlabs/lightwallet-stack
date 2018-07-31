import { Component, Input } from "@angular/core";
import { Store } from "@ngrx/store";

import { MiningView } from "@merit/desktop/app/core/mining/mining.view";
import { BaseGpuWidget } from "@merit/desktop/app/components/charts/base-gpu-widget.component";
import {
  GpuAddDatasetsAction,
  GpuAddStatAction,
  IGPUStat,
  IGPUStatDataset
} from "@merit/common/reducers/gpustats.reducer";
import { IRootAppState } from "@merit/common/reducers";

@Component({
  selector: "gpu-temp-widget",
  templateUrl: "../base-gpu-widget.component.html",
  styleUrls: ["../base-gpu-widget.component.sass"]
})
export class GpuTempWidgetComponent extends BaseGpuWidget {
  @Input() active_gpu_devices: number[];

  constructor(protected store: Store<IRootAppState>) {
    super();
  }

  protected updateData(): void {
    let data = MiningView.getGPUInfo();

    data = data.filter((item, index, array) => {
      return this.active_gpu_devices.includes(item.id);
    });

    // Initializing dataset for each GPU
    if (!this.datasets || this.datasets == undefined || this.datasets.length == 0) {
      let ds: IGPUStatDataset[] = [];
      ds.length = data.length;

      for (let i = 0; i < data.length; i++) {
        ds[i] = {
          data: [],
          label: data[i].title,
          borderColor: "#00b0dd"
        };
      }

      this.datasets = ds;
      this.store.dispatch(new GpuAddDatasetsAction(this.slug, ds));
      }

    // Push data
    let dataToPush: IGPUStat[] = [];
    for (let i = 0; i < this.datasets.length; i++) {
      let item = { t: new Date(), y: data[i].temperature };
      this.datasets[i].data.push(item);
      dataToPush.push(item);
    }

    this.store.dispatch(new GpuAddStatAction(this.slug, dataToPush));

    this.chart.data.datasets = this.datasets;
    this.chart.update();

    this.updateTimer = setTimeout(this.updateData.bind(this), this.updateInterval);
  }
}
