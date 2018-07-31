import { Component, Input } from "@angular/core";
import * as Chart from "chart.js";
import { MiningView } from "@merit/desktop/app/core/mining/mining.view";
import { BaseGpuWidget } from "@merit/desktop/app/components/charts/base-gpu-widget.component";
import {
  GpuAddDatasetsAction,
  GpuAddStatAction,
  IGPUStat,
  IGPUStatDataset
} from "@merit/common/reducers/gpustats.reducer";
import { Store } from "@ngrx/store";
import { IRootAppState } from "@merit/common/reducers";

@Component({
  selector: "gpu-utilization-widget",
  templateUrl: "../base-gpu-widget.component.html",
  styleUrls: ["../base-gpu-widget.component.sass"]
})

export class GpuUtilizationWidgetComponent extends BaseGpuWidget {
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
      ds.length = data.length * 2;

      for (let i = 0; i < data.length; i++) {
        ds[2 * i] = {
          data: [],
          label: data[i].title + " cores",
          borderColor: "#0046ff"
        };

        ds[2 * i + 1] = {
          data: [],
          label: data[i].title + " memory",
          borderColor: "#2eb483"
        };
      }

      this.datasets = ds;
      this.store.dispatch(new GpuAddDatasetsAction(this.slug, ds));

    }
    // Push data
    let dataToPush: IGPUStat[] = [];
    for (let i = 0; i < data.length; i++) {
      let util_item = { t: new Date(), y: data[i].gpu_util };
      let temp_item = { t: new Date(), y: data[i].memory_util };

      this.datasets[2 * i].data.push(util_item);
      this.datasets[2 * i + 1].data.push(temp_item);
      dataToPush.push(util_item);
      dataToPush.push(temp_item);
    }

    this.store.dispatch(new GpuAddStatAction(this.slug, dataToPush));

    this.chart.data.datasets = this.datasets;
    this.chart.update();

    this.updateTimer = setTimeout(this.updateData.bind(this), this.updateInterval);
  }
}
