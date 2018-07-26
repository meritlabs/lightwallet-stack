import { ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { Store } from '@ngrx/store';
import { IRootAppState } from "@merit/common/reducers";
import { IGPUStatDataset, selectGpuStatsState } from "@merit/common/reducers/gpustats.reducer";

export abstract class BaseGpuWidget implements OnInit, OnChanges, OnDestroy {
  @ViewChild("canvas")
  protected canvas: ElementRef;

  @Input() active_gpu_devices: number[];
  @Input() slug: string;

  protected store: Store<IRootAppState>;
  datasets: IGPUStatDataset[] = [];

  protected updateTimer: any;
  protected updateInterval: number;
  protected baseChartConfig: {};

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