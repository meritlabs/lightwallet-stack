import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'chunks' })
export class ChunksPipe implements PipeTransform {
  transform(arr: any, chunkSize: number) {
    return arr.reduce(
      (prev, cur, index) => (index % chunkSize ? prev : prev.concat([arr.slice(index, index + chunkSize)])),
      [],
    );
  }
}
