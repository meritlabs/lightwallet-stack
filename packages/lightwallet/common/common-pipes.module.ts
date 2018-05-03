import { NgModule } from '@angular/core';
import { ChunksPipe } from '@merit/common/pipes/chunks.pipe';
import { ToFiatPipe } from '@merit/common/pipes/to-fiat.pipe';
import { ToUnitPipe } from '@merit/common/pipes/to-unit.pipe';
import { ToMrtPipe } from '@merit/common/pipes/to-mrt.pipe';
import { UnescapePipe } from '@merit/common/pipes/unescape.pipe';
import { AddressPipe } from '@merit/common/pipes/address.pipe';

@NgModule({
  declarations: [
    ChunksPipe,
    ToFiatPipe,
    ToUnitPipe,
    ToMrtPipe,
    UnescapePipe,
    AddressPipe
  ],
  exports: [
    ChunksPipe,
    ToFiatPipe,
    ToUnitPipe,
    ToMrtPipe,
    UnescapePipe,
    AddressPipe
  ]
})
export class CommonPipesModule {}
