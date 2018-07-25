import { Component } from "@angular/core";
import * as Chart from "chart.js";
import { MiningView } from "@merit/desktop/app/core/mining/mining.view";
import { BaseGpuWidget } from "@merit/desktop/app/components/charts/base-gpu-widget";

@Component({
  selector: "gpu-temp-widget",
  templateUrl: "../base-gpu-widget.component.html",
  styleUrls: ["../base-gpu-widget.component.sass"]
})

export class GpuTempWidgetComponent extends BaseGpuWidget {
  constructor() {
    super();
  }

  protected updateData(): void {
    let data = MiningView.getGPUInfo();

    data = data.filter((item, index, array) => {return this.active_gpu_devices.includes(item.id) });

    // Initializing dataset for each GPU
    if (this.datasets.length == 0) {
      this.datasets.length = data.length;

      for (let i = 0; i < data.length; i++) {
        this.datasets[i] = {
          data: [],
          label: data[i].title,
          borderColor: "#00b0dd"
        };
      }
    }

    // Push data
    for (let i = 0; i < this.datasets.length; i++)
      this.datasets[i].data.push({ t: new Date(), y: data[i].temperature });

    this.chart.update();

    console.log("Chart updated", this.chart);
    console.log(this.datasets);

    this.updateTimer = setTimeout(this.updateData.bind(this), this.updateInterval);
  }

  protected createChart() {
    let chartConfig = this.baseChartConfig;
    chartConfig["options"]["title"]["text"] = "GPU Temperature(degrees Celsius)";
    chartConfig["data"] = { datasets: this.datasets };

    this.chart = new Chart(this.canvas.nativeElement, chartConfig);
  }
}
