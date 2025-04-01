import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiLineAbbreviation',
  standalone: true
})
export class MultiLineAbbreviationPipe implements PipeTransform {

  transform(value: string, multilines = 1): string {
      const lines = value.split('\n');
      if (lines.length > multilines) {
        console.log(value, lines)
        return lines.slice(0, 5).join('\n') + '...';
      }

    return value;
  }

}
