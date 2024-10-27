import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: '[app-icon]',
  standalone: true,
  imports: [],
  template: `<i [class]="'bi bi-' + icon()"></i> <ng-content></ng-content>`
})
export class IconComponent {

  icon = input.required<string>({ alias: 'app-icon' });
  colour = input<'success' | 'primary' | 'secondary' | 'danger' | 'link' | 'dark' | null>(null, { alias: 'app-icon-colour' });
  size = input<'lg' | 'sm' | null>(null, { alias: 'app-icon-size' });

  @HostBinding('class')
  get classes() {
    let classes = 'btn';

    if (this.colour()) {
      classes += ` btn-${this.colour()}`;
    }

    if (this.size()) {
      classes += ` btn-${this.size()}`;
    }

    return classes;
  }

}
