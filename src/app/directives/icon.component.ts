import { Component, computed, input } from '@angular/core';

@Component({
  selector: '[app-icon]',
  standalone: true,
  imports: [],
  template: `<i [class]="'bi bi-' + icon()"></i> <ng-content></ng-content>`,
  host: {
    '[class]': 'classes()'
  }
})
export class IconComponent {

  readonly icon = input.required<string>({ alias: 'app-icon' });
  readonly colour = input<'success' | 'primary' | 'secondary' | 'danger' | 'link' | 'dark' | null>(null, { alias: 'app-icon-colour' });
  readonly size = input<'lg' | 'sm' | null>(null, { alias: 'app-icon-size' });

  readonly classes = computed(() => {
    let classes = 'btn';

    if (this.colour()) {
      classes += ` btn-${this.colour()}`;
    }

    if (this.size()) {
      classes += ` btn-${this.size()}`;
    }

    return classes;
  });

}
