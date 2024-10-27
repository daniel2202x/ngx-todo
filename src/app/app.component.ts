import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { VersionCheckComponent } from '@app/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VersionCheckComponent],
  template: '<router-outlet></router-outlet><app-version-check></app-version-check>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}
