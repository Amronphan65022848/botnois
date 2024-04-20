import { Pipe, type PipeTransform } from '@angular/core';
import { TResponsePackage } from '../models/wallet-model';
import { Pages } from '../models/buy-point-model';

@Pipe({
  name: 'packageType',
  standalone: true,
})
export class BuyPointsPipe implements PipeTransform {
  transform(
    value: TResponsePackage[],
    currentType: number,
    isSaleEvent: boolean,
    page: Pages,
  ): TResponsePackage[] {
    if (isSaleEvent) {
      let notShowThisPrice: 200 | 1000 = 200;
      if (page === 'studio') {
        notShowThisPrice = 1000;
      }

      return value.filter(
        (e) => e.type === 6 && e.price_discount !== notShowThisPrice,
      );
    }
    return value.filter((e) => e.type === currentType);
  }
}
