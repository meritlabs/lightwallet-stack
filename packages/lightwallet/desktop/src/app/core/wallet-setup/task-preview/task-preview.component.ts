import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.sass'],
})
export class TaskPreviewComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  @Input() goal: Object;
  log(val) {
    console.log(val);
  }
}
