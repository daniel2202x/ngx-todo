import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Actions } from '@ngneat/effects-ng';

import { OfflineService } from '@app/services';
import { MenuComponent } from '@app/components';
import { IconComponent } from '@app/directives';
import { createTodo } from '@app/actions';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, IconComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  private readonly actions = inject(Actions);
  readonly offlineService = inject(OfflineService);

  readonly showMenu = signal(false);

  createTodo() {
    this.actions.dispatch(createTodo());
  }

  openMenu() {
    this.showMenu.set(true);
  }
}
