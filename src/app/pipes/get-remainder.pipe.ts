import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getRemainder'
})
export class GetRemainderPipe implements PipeTransform {

  transform(value: string | number, ...args: any[]): number {
    return Math.floor(+value);
  }

}
