import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortNumber' })
export class ShortNumberPipe implements PipeTransform {
  transform(value: number, args?: any): string {
    if (isNaN(value)) return '-';

    if (value < 1000) return value.toString();

    const suffixes = ['K', 'M', 'G', 'T', 'P', 'E'];
    const exp = Math.floor(Math.log(value) / Math.log(1000));
    return (value / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
  }
}
