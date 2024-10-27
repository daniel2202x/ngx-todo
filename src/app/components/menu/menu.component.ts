import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { TodoService, AuthService } from '@app/services';
import { IconComponent } from '@app/directives';
import { LangauagePickerComponent } from '@app/components';
import { AuthRepository } from '@app/state';

import version from '@app/version';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [AsyncPipe, IconComponent, LangauagePickerComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('menuAnimLeft', [
      state('void', style({ marginLeft: '-50%', backdropFilter: 'blur(0)' })),
      transition('void => opened', [
        style({ marginLeft: '-50%', backdropFilter: 'blur(0)' }),
        animate('200ms', style({ marginLeft: '0%', backdropFilter: 'blur(4px)' }))
      ]),
      transition('opened => closed', [
        style({ marginLeft: '0%', backdropFilter: 'blur(4px)' }),
        animate('200ms', style({ marginLeft: '-50%', backdropFilter: 'blur(0)' }))
      ]),
      state('closed', style({ marginLeft: '-50%', backdropFilter: 'blur(0)' }))
    ]),
    trigger('menuAnimRight', [
      state('void', style({ backdropFilter: 'blur(0)' })),
      transition('void => opened', [
        style({ backdropFilter: 'blur(0)' }),
        animate('200ms', style({ backdropFilter: 'blur(4px)' }))
      ]),
      transition('opened => closed', [
        style({ backdropFilter: 'blur(4px)' }),
        animate('200ms', style({ backdropFilter: 'blur(0)' }))
      ]),
      state('closed', style({ backdropFilter: 'blur(0)' }))
    ])
  ]
})
export class MenuComponent {
  private authService = inject(AuthService);
  private authRepository = inject(AuthRepository);
  private todoService = inject(TodoService);
  private router = inject(Router);

  build = version.build;

  open = model.required<boolean>();
  menuAnimState = signal<'closed' | 'opened'>('opened');

  displayName$ = this.authRepository.displayName$;

  refresh() {
    this.todoService.refreshAll().subscribe();
  }

  logout() {
    this.authService.logout();
  }

  close() {
    this.menuAnimState.set('closed');
  }

  animationDone() {
    if (this.menuAnimState() === 'closed') {
      this.open.set(false);
    }
  }

  createTodo() {
    this.todoService.createEmptyTodo()
      .subscribe(todo => {
        this.close();
        this.router.navigate(['todos', todo.id]);
      });
  }
}
