import { Pipe, PipeTransform } from '@angular/core';
import { AudioStorageApiService } from 'src/app/storage/services/audio-storage-api.service';

@Pipe({
  name: 'pagination'
})
export class PaginationPipe implements PipeTransform {
  constructor(
    private _audioStorageApi: AudioStorageApiService,
  ) { }
  transform(value: any[], page: number, resultCount: number): any {
    const temp = [...value.slice(resultCount * (page - 1), resultCount * (page))]
    if (temp.length > 0) this._audioStorageApi.searchData.next(temp)

    return temp

    // return [...value]
  }

}
