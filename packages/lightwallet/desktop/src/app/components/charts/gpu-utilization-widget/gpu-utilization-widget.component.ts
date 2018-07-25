import { Component } from "@angular/core";
import * as Chart from "chart.js";
import { MiningView } from "@merit/desktop/app/core/mining/mining.view";
import { BaseGpuWidget } from "@merit/desktop/app/components/charts/base-gpu-widget";
import { GPUInfo } from "@merit/desktop/app/core/mining/gpu-info.model";

@Component({
  selector: "gpu-utilization-widget",
  templateUrl: "../base-gpu-widget.component.html",
  styleUrls: ["../base-gpu-widget.component.sass"]
})

export class GpuUtilizationWidgetComponent extends BaseGpuWidget {
  constructor() {
    super();
  }

  protected updateData(): void {
    let data = MiningView.getGPUInfo();

    data = data.filter((item, index, array) => {return this.active_gpu_devices.includes(item.id) });

    // Initializing dataset for each GPU
    if (this.datasets.length == 0) {
      this.datasets.length = data.length * 2;

      for (let i = 0; i < data.length; i++) {
        this.datasets[2 * i] = {
          data: [],
          label: data[i].title + " cores",
          borderColor: "#00dd4f"
        };

        this.datasets[2 * i + 1] = {
          data: [],
          label: data[i].title + " memory",
          borderColor: "#cd00dd"
        };
      }
    }
    // Push data
    for (let i = 0; i < data.length; i++) {
      this.datasets[2 * i].data.push({ t: new Date(), y: data[i].gpu_util });
      this.datasets[2 * i + 1].data.push({ t: new Date(), y: data[i].memory_util });
    }

    this.chart.update();

    console.log("Chart updated", this.chart);
    console.log(this.datasets);

    this.updateTimer = setTimeout(this.updateData.bind(this), this.updateInterval);
  }

  protected createChart() {
    let chartConfig = this.baseChartConfig;
    chartConfig["options"]["title"]["text"] = "GPU cores and memory utilization(%)";
    chartConfig["data"] = { datasets: this.datasets };

    this.chart = new Chart(this.canvas.nativeElement, chartConfig);
  }
}