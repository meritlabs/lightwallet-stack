import { NgModule } from '@angular/core';
import { AddressErrorMessagePipe } from '@merit/common/pipes/address-error-message.pipe';
import { AliasErrorMessagePipe } from '@merit/common/pipes/alias-error-message.pipe';
import { ChunksPipe } from '@merit/common/pipes/chunks.pipe';
import { ToFiatPipe } from '@merit/common/pipes/to-fiat.pipe';
import { ToUnitPipe } from '@merit/common/pipes/to-unit.pipe';
import { ToMrtPipe } from '@merit/common/pipes/to-mrt.pipe';
import { UnescapePipe } from '@merit/common/pipes/unescape.pipe';
import { AddressPipe } from '@merit/common/pipes/address.pipe';
import { AbsPipe } from '@merit/common/pipes/abs.pipe';

@NgModule({
  declarations: [
    ChunksPipe,
    ToFiatPipe,
    ToUnitPipe,
    ToMrtPipe,
    UnescapePipe,
    AddressPipe,
    AddressErrorMessagePipe,
    AliasErrorMessagePipe,
    AbsPipe,
  ],
  exports: [
    ChunksPipe,
    ToFiatPipe,
    ToUnitPipe,
    ToMrtPipe,
    UnescapePipe,
    AddressPipe,
    AddressErrorMessagePipe,
    AliasErrorMessagePipe,
    AbsPipe,
  ]
})
export class CommonPipesModule {}
