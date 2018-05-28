import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-quest-preview',
  templateUrl: './quest-preview.component.html',
  styleUrls: ['./quest-preview.component.sass'],
})
export class QuestPreviewComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  @Input() quest: Object;
}
