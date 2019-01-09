import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'vaults-list',
  templateUrl: './vaults-list.component.html',
  styleUrls: ['./vaults-list.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VaultsListComponent {
  @Input()
  showButton: boolean = true;
  @Input()
  vaults: any[];
}
