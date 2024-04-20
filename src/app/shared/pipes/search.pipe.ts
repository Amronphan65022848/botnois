import { Pipe, PipeTransform } from '@angular/core';
import { AudioStorageApiService } from 'src/app/storage/services/audio-storage-api.service';
import { Voice_data } from '../models/shared-model';

@Pipe({
  name: 'audioSearch'
})
export class audioSearchPipe implements PipeTransform {
  constructor(){

  }

  transform(value: any, data:Array<Voice_data>, searchValue:any, param:string): any {
    if (searchValue?.length <= 0) return value;
    const temp = data.filter((v) => v[param].toLowerCase().indexOf(searchValue.toLowerCase()) > -1)//.slice(0 , 5)
    return temp
  }
}
