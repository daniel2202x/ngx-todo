import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiLineAbbreviation',
  standalone: true
})
export class MultiLineAbbreviationPipe implements PipeTransform {

  transform(value: unknown): unknown {
    if (typeof value === 'string') {
      const lines = value.split('\n');
      if (lines.length > 1) {
        return lines[0] + '...';
      }
    }

    return value;
  }

}
