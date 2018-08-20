import { Component, Input } from "@angular/core";
import * as Chart from "chart.js";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { IMiningDataset } from "@merit/common/reducers/mining.reducer";
import * as moment from 'moment';

@Component({
  selector: "chart",
  templateUrl: "./base-gpu-widget.component.html",
  styleUrls: ["./base-gpu-widget.component.sass"]
})
export abstract class BaseGpuWidget{
  // options
  gradient = false;
  showXAxis = true;
  showYAxis = true;

  showXAxisLabel = true;
  showYAxisLabel = false;

  colorScheme: object = {
    domain: ["#00b0dd", "#2eb483", "#2c3141"]
  };

  @Input() title: string = "Chart";
  @Input() slug: string = "slug-example";
  @Input() legend: boolean = false; // do show the legend or not?

  // chart dataset (The data format is multi series)
  protected _datasets: IMiningDataset[] = [];

  @Input()
  set datasets(value: IMiningDataset[]) {
    if(value == null){
      this._datasets = [];
    } else {
      this._datasets = value;
    }
  }

  get datasets(): IMiningDataset[] {
    return this._datasets;
  }

  dateTickFormatting(val: Date): string {
    return moment(val).format('LTS');  // format -> 12:48:37 PM
  }

}
