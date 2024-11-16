import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Actions } from '@ngneat/effects-ng';

import { map } from 'rxjs';

import { OfflineService } from '@app/services';
import { MenuComponent } from '@app/components';
import { IconComponent, SpinnerDirective } from '@app/directives';
import { createTodo } from '@app/actions';
import { TodoRepository } from '@app/state';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, IconComponent, SpinnerDirective, AsyncPipe],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  private readonly actions = inject(Actions);
  private readonly todoRepository = inject(TodoRepository);
  readonly offlineService = inject(OfflineService);

  readonly showMenu = signal(false);

  readonly isCreatingTodo$ = this.todoRepository.createTodoResult$.pipe(map(result => result.isLoading));

  createTodo() {
    this.actions.dispatch(createTodo());
  }

  openMenu() {
    this.showMenu.set(true);
  }
}
