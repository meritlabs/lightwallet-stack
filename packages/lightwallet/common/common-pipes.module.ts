import { NgModule } from '@angular/core';
import { ChunksPipe } from '@merit/common/pipes/chunks.pipe';
import { ToFiatPipe } from '@merit/common/pipes/to-fiat.pipe';
import { ToUnitPipe } from '@merit/common/pipes/to-unit.pipe';

@NgModule({
  declarations: [
    ChunksPipe,
    ToFiatPipe,
    ToUnitPipe
  ],
  exports: [
    ChunksPipe,
    ToFiatPipe,
    ToUnitPipe
  ]
})
export class CommonPipesModule {}
