import { NgModule } from '@angular/core';
import { ChunksPipe } from '@merit/common/pipes/chunks';
import { ToFiatPipe } from '@merit/common/pipes/to-fiat';
import { ToUnitPipe } from '@merit/common/pipes/to-unit';

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
