import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ShowContentByPage'
})
export class ShowContentByPagePipe implements PipeTransform {
  constructor(
  ) { }
  transform(value: any[], page): any {
    return value.filter((e) => e.page == page)
  }

}
