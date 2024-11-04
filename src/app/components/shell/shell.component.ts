import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { OfflineService, TodoService } from '@app/services';
import { MenuComponent } from '@app/components';
import { IconComponent } from '@app/directives';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, IconComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  private readonly router = inject(Router);
  private readonly todoService = inject(TodoService);

  readonly offlineService = inject(OfflineService);

  readonly showMenu = signal(false);

  createTodo() {
    this.todoService.createEmptyTodo()
      .subscribe(todo => {
        this.router.navigate(['todos', todo.id]);
      });
  }

  openMenu() {
    this.showMenu.set(true);
  }
}
