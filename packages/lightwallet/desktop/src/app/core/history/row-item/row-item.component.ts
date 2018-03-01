import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-row-item',
  templateUrl: './row-item.component.html',
  styleUrls: ['./row-item.component.sass']
})
export class RowItemComponent implements OnInit {
  @Input() item: any;
  constructor() {}
  ngOnInit() {}
}
