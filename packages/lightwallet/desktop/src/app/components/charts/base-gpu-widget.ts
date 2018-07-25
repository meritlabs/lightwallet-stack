import { ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";

export abstract class BaseGpuWidget implements OnInit, OnChanges, OnDestroy {
  @ViewChild("canvas")
  protected canvas: ElementRef;

  @Input() active_gpu_devices: number[];

  protected datasets: any[];
  protected updateTimer: any;
  protected updateInterval: number;
  protected baseChartConfig: {};

  chart: any;

  constructor() {
    this.baseChartConfig = {
      type: "line",
      data: { datasets: this.datasets },
      options: {
        pointStyle: 'line',
        tooltips: { enabled: 'false' },
        title: { display: true },
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
    };
  }

  ngOnInit() {
    this.datasets = [];
    this.createChart();
    this.updateInterval = 4000;

    this.updateTimer = setTimeout(this.updateData.bind(this), this.updateInterval);
  }

  protected abstract updateData(): void;

  protected abstract createChart(): void;


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