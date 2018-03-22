import { NgModule } from '@angular/core';
import { ChunksPipe } from '@merit/common/pipes/chunks.pipe';
import { ToFiatPipe } from '@merit/common/pipes/to-fiat.pipe';
import { ToUnitPipe } from '@merit/common/pipes/to-unit.pipe';
import { ToMrtPipe } from '@merit/common/pipes/to-mrt.pipe';

@NgModule({
  declarations: [
    ChunksPipe,
    ToFiatPipe,
    ToUnitPipe,
    ToMrtPipe
  ],
  exports: [
    ChunksPipe,
    ToFiatPipe,
    ToUnitPipe,
    ToMrtPipe
  ]
})
export class CommonPipesModule {}
