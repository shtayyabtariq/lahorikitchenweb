import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mycurrency'
})
export class CurrencyPipe implements PipeTransform {

  transform(
    value: number,
    currencyCode: string = 'PKR',
    display:
        | 'code'
        | 'symbol'
        | 'symbol-narrow'
        | string
        | boolean = 'symbol',
    digitsInfo: string = '0.2-2',
    locale: string = 'en-US',
): string | null {
    return formatCurrency(
      value,
      locale,
      getCurrencySymbol(currencyCode, 'narrow'),
      currencyCode,
      digitsInfo,
    );
}

}
