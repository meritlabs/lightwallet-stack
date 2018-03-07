import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'vaults-list',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VaultsListComponent {
  @Input() showButton: boolean = true;
  @Input() vaults: any[];
}
