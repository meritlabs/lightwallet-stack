import { Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import * as Chart from "chart.js";
import { MiningView } from "@merit/desktop/app/core/mining/mining.view";

@Component({
  selector: "gpu-utilization-widget",
  templateUrl: "./gpu-utilization-widget.component.html",
  styleUrls: ["./gpu-utilization-widget.component.sass"]
})

export class GpuUtilizationWidgetComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild("canvas")
  private canvas: ElementRef;
  private datasets: any[];
  private updateTimer: any;

  chart: any;

  constructor() {}

  ngOnInit() {
    this.datasets = [];
    this.createChart();

    this.updateTimer = setTimeout(this.updateData.bind(this), 1000);
  }

  private updateData(): void {
    let data = MiningView.getGPUInfo();

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
    for (let i = 0; i < data.length; i++){
      this.datasets[2 * i].data.push({ t: new Date(), y: data[i].gpu_util });
      this.datasets[2 * i + 1].data.push({ t: new Date(), y: data[i].memory_util });
    }

    this.chart.update();

    this.updateTimer = setTimeout(this.updateData.bind(this), 1000);
  }

  private createChart() {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: "line",
      data: { datasets: this.datasets },
      options: {
        pointStyle: 'line',
        tooltips: {
          enabled: 'false'
        },
        title: {
          display: true,
          text: 'GPU cores and memory utilization(%)'
        },
        responsive: true,
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            type: "time",
            time: { displayFormats: { minute: "h:mm a" } },
            distribution: "linear"
          }],

          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });
  }

  ngOnDestroy() {
    this.deleteChart();
  }

  private deleteChart() {
    this.chart && this.chart.clear() && this.chart.destroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chart && this.chart.resize();
  }
}