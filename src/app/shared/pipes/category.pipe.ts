import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  transform(data: any[], category: number) {   
    return data.filter((v:any) => v['type'] == category)
  }

}
