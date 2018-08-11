import { Component } from '@angular/core';
import { BaseGpuWidget } from '@merit/desktop/app/components/charts/base-gpu-widget.component';


@Component({
  selector: 'chart',
  templateUrl: './base-gpu-widget.component.html',
  styleUrls: ['./base-gpu-widget.component.sass']
})
export class ChartComponent extends BaseGpuWidget {
}
