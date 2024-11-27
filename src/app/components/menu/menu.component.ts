import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AsyncPipe } from '@angular/common';

import { Actions } from '@ngneat/effects-ng';

import { AuthService, ShellService } from '@app/services';
import { IconComponent } from '@app/directives';
import { LangauagePickerComponent } from '@app/components';
import { AuthRepository } from '@app/state';

import version from '@app/version';
import { createTodo, loadTodos } from '@app/actions';

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
  private readonly authService = inject(AuthService);
  private readonly authRepository = inject(AuthRepository);
  private readonly actions = inject(Actions);
  private readonly shellService = inject(ShellService);

  readonly build = version.build;

  readonly open = model.required<boolean>();
  readonly menuAnimState = signal<'closed' | 'opened'>('opened');

  readonly displayName$ = this.authRepository.displayName$;

  refresh() {
    this.shellService.refresh$.next();
    this.actions.dispatch(loadTodos());
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
    this.close();
    this.actions.dispatch(createTodo());
  }
}
