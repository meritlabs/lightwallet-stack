import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { IRootAppState } from "@merit/common/reducers";
import * as Chart from "chart.js";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { IMiningDataset } from "@merit/common/reducers/mining.reducer";

@Component({
  selector: "chart",
  templateUrl: "./base-gpu-widget.component.html",
  styleUrls: ["./base-gpu-widget.component.sass"]
})
export abstract class BaseGpuWidget implements OnInit, OnChanges, OnDestroy {
  // @ViewChild("canvas")
  // protected canvas: ElementRef;

  @Input() title: string = "Chart";
  @Input() slug: string = "slug-example";

  data: any[] = [
    {
      "name": "Czech Republic",
      "series": [
        {
          "value": 4851,
          "name": "2016-09-23T09:25:03.078Z"
        },
        {
          "value": 2616,
          "name": "2016-09-17T17:04:40.551Z"
        },
        {
          "value": 3538,
          "name": "2016-09-21T14:42:13.143Z"
        },
        {
          "value": 4596,
          "name": "2016-09-20T17:26:54.822Z"
        },
        {
          "value": 5164,
          "name": "2016-09-21T12:12:01.073Z"
        }
      ]
    },
    {
      "name": "Croatia",
      "series": [
        {
          "value": 2067,
          "name": "2016-09-23T09:25:03.078Z"
        },
        {
          "value": 2737,
          "name": "2016-09-17T17:04:40.551Z"
        },
        {
          "value": 5377,
          "name": "2016-09-21T14:42:13.143Z"
        },
        {
          "value": 6766,
          "name": "2016-09-20T17:26:54.822Z"
        },
        {
          "value": 3659,
          "name": "2016-09-21T12:12:01.073Z"
        }
      ]
    },
    {
      "name": "El Salvador",
      "series": [
        {
          "value": 2749,
          "name": "2016-09-23T09:25:03.078Z"
        },
        {
          "value": 4213,
          "name": "2016-09-17T17:04:40.551Z"
        },
        {
          "value": 4038,
          "name": "2016-09-21T14:42:13.143Z"
        },
        {
          "value": 3292,
          "name": "2016-09-20T17:26:54.822Z"
        },
        {
          "value": 3947,
          "name": "2016-09-21T12:12:01.073Z"
        }
      ]
    },
    {
      "name": "Tunisia",
      "series": [
        {
          "value": 3639,
          "name": "2016-09-23T09:25:03.078Z"
        },
        {
          "value": 6525,
          "name": "2016-09-17T17:04:40.551Z"
        },
        {
          "value": 3592,
          "name": "2016-09-21T14:42:13.143Z"
        },
        {
          "value": 5422,
          "name": "2016-09-20T17:26:54.822Z"
        },
        {
          "value": 4470,
          "name": "2016-09-21T12:12:01.073Z"
        }
      ]
    },
    {
      "name": "Denmark",
      "series": [
        {
          "value": 6974,
          "name": "2016-09-23T09:25:03.078Z"
        },
        {
          "value": 6373,
          "name": "2016-09-17T17:04:40.551Z"
        },
        {
          "value": 6972,
          "name": "2016-09-21T14:42:13.143Z"
        },
        {
          "value": 6269,
          "name": "2016-09-20T17:26:54.822Z"
        },
        {
          "value": 6020,
          "name": "2016-09-21T12:12:01.073Z"
        }
      ]
    }
  ];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = false;

  colorScheme: object = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"]
  };

  onSelect(event) {
    console.log(event);
  }

  protected _datasets: IMiningDataset[] = [];

  @Input()
  set datasets(value: IMiningDataset[]) {
    this._datasets = value;
    // if (this.chart) {
    //   // this.chart.data.datasets = this._datasets;
    //   // this.chart.update();
    // }
  }

  get datasets(): IMiningDataset[] {
    return this._datasets;
  }

  protected store: Store<IRootAppState>;
  protected borderColors: string[] = ["#00b0dd", "#2eb483"];

  chart: any;

  ngOnInit() {
    // this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.chart && this.chart.resize();
  }

  ngOnDestroy() {
    // this.deleteChart();
  }

  protected createChart(): void {
    // const chartConfig = {
    //   type: 'line',
    //   data: {datasets: this.datasets},
    //   options: {
    //     pointStyle: 'line',
    //     tooltips: {enabled: 'false'},
    //     title: {text: this.title, display: true},
    //     responsive: true,
    //     legend: {
    //       display: true,
    //       position: 'bottom'
    //     },
    //     scales: {
    //       xAxes: [{
    //         type: 'time',
    //         time: {displayFormats: {minute: 'h:mm a'}},
    //         distribution: 'linear',
    //         ticks: {
    //           autoSkip: true,
    //           maxTicksLimit: 20
    //         }
    //       }],
    //       yAxes: [{
    //         ticks: {
    //           beginAtZero: false
    //         }
    //       }]
    //     }
    //   }
    // };

    // this.chart = new Chart(this.canvas.nativeElement, chartConfig);
  }

  private deleteChart() {
    // this.chart && this.chart.clear() && this.chart.destroy();
  }
}
