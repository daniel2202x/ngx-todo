import { Component, computed, input } from '@angular/core';

@Component({
  selector: '[appIcon]',
  standalone: true,
  imports: [],
  template: `<i [class]="'bi bi-' + appIcon()"></i> <ng-content></ng-content>`,
  host: {
    '[class]': 'classes()'
  }
})
export class IconComponent {

  readonly appIcon = input.required<string>();
  readonly appIconColour = input<'success' | 'primary' | 'secondary' | 'danger' | 'link' | 'dark' | null>(null);
  readonly appIconSize = input<'lg' | 'sm' | null>(null);

  readonly classes = computed(() => {
    let classes = 'btn';

    if (this.appIconColour()) {
      classes += ` btn-${this.appIconColour()}`;
    }

    if (this.appIconSize()) {
      classes += ` btn-${this.appIconSize()}`;
    }

    return classes;
  });

}
