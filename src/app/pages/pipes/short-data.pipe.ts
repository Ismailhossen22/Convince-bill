import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shortDate',
    standalone: true
})
export class ShortDatePipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return '';
        const date = new Date(value);
        const day = date.getDate();
        const month = date.toLocaleString('en', { month: 'short' });
        return `${day}-${month}`;
    }
}