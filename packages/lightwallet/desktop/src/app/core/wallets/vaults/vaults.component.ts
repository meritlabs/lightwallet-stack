import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.sass']
})
export class VaultsComponent implements OnInit {
  @Input() showButton: boolean;
  constructor() {}
  ngOnInit() {}
}
