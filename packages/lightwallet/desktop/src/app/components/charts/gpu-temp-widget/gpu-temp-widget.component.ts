import { Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import * as Chart from "chart.js";
import { MiningView } from "../../../core/mining/mining.view";

@Component({
  selector: "gpu-temp-widget",
  templateUrl: "./gpu-temp-widget.component.html",
  styleUrls: ["./gpu-temp-widget.component.sass"]
})

export class GpuTempWidgetComponent implements OnInit, OnChanges, OnDestroy {
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
          text: 'GPU Temperature'
        },
        responsive: true,
        legend: { display: true },
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
