import { ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import * as Chart from 'chart.js';
import { IMiningDataset } from '@merit/common/reducers/mining.reducer';

export abstract class BaseGpuWidget implements OnInit, OnChanges, OnDestroy {
  @ViewChild('canvas')
  protected canvas: ElementRef;

  @Input() title: string = 'Chart';
  @Input() slug: string = 'slug-example';

  protected  _datasets: IMiningDataset[] = [];

  @Input()
  set datasets(value: IMiningDataset[]) {
    this._datasets = value;
    if (this.chart) {
      this.chart.data.datasets = this._datasets;
      this.chart.update();
    }
  }

  get datasets(): IMiningDataset[] {
    return this._datasets;
  }

  protected store: Store<IRootAppState>;
  protected borderColors: string[] = ['#00b0dd', '#2eb483'];

  chart: any;

  ngOnInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.chart && this.chart.resize();
  }

  ngOnDestroy() {
    this.deleteChart();
  }

  protected createChart(): void {
    const chartConfig = {
      type: 'line',
      data: {datasets: this.datasets},
      options: {
        pointStyle: 'line',
        tooltips: {enabled: 'false'},
        title: {text: this.title, display: true},
        responsive: true,
        legend: {
          display: true,
          position: 'bottom'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {displayFormats: {minute: 'h:mm a'}},
            distribution: 'linear',
            ticks: {
              autoSkip: true,
              maxTicksLimit: 20
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    };

    this.chart = new Chart(this.canvas.nativeElement, chartConfig);
  }

  private deleteChart() {
    this.chart && this.chart.clear() && this.chart.destroy();
  }
}
