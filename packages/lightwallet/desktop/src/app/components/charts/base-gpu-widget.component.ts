import { ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { Store } from '@ngrx/store';

import { IRootAppState } from "@merit/common/reducers";
import { IGPUStatDataset, selectGpuStatsState } from "@merit/common/reducers/gpustats.reducer";

import * as Chart from "chart.js";

export abstract class BaseGpuWidget implements OnInit, OnChanges, OnDestroy {
  @ViewChild("canvas")
  protected canvas: ElementRef;

  @Input() title: string = "Chart";
  @Input() slug: string = "slug-example";
  @Input() updateInterval: string = "Chart";

  protected store: Store<IRootAppState>;
  datasets: IGPUStatDataset[] = [];

  protected updateTimer: any;
  protected baseChartConfig: {};
  protected borderColors: string[] = ["#00b0dd", "#2eb483"];

  chart: any;

  constructor() {}

  ngOnInit() {
    this.store.select(selectGpuStatsState).subscribe(data => {
      this.datasets = data.stats[this.slug];

      if(this.chart)
        this.chart.data.datasets = this.datasets;
    });

    this.baseChartConfig = {
      type: "line",
      data: { datasets: this.datasets },
      options: {
        pointStyle: 'line',
        tooltips: { enabled: 'false' },
        title: { display: true },
        responsive: true,
        legend: {
          display: true,
          position: 'bottom'
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
    };

    this.createChart();

    this.updateTimer = setTimeout(this.updateData.bind(this), this.updateInterval);
  }

  protected abstract updateData(): void;

  protected createChart(): void {
    let chartConfig = this.baseChartConfig;
    chartConfig["options"]["title"]["text"] = this.title;
    chartConfig["data"] = { datasets: this.datasets };

    this.chart = new Chart(this.canvas.nativeElement, chartConfig);
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
