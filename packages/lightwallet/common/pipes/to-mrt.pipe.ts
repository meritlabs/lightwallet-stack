import { Pipe, PipeTransform } from '@angular/core';
import { RateService } from '@merit/common/services/rate.service';

@Pipe({ name: 'toMRT' })
export class ToMrtPipe implements PipeTransform {
  private unitCode: string;

  constructor(
    private rateService: RateService
  ) {}

  transform(micros: number): string {
    return this.rateService.microsToMrt(micros)+' MRT';
  }
}
