import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

import { debounceTime, filter, map, merge, of, switchMap, take, tap } from 'rxjs';

import { Actions } from '@ngneat/effects-ng';

import { IconComponent } from '@app/directives';
import { TodoRepository } from '@app/state';
import { updateTodo } from '@app/actions';
import { ShellService } from '@app/services';

@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, RouterLink],
  templateUrl: './todo-edit.component.html',
  styleUrl: './todo-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoEditComponent implements OnInit {

  private readonly pageTitle = inject(Title);
  private readonly destroyRef = inject(DestroyRef);
  private readonly todoRepository = inject(TodoRepository);
  private readonly actions = inject(Actions);
  private readonly shellService = inject(ShellService);

  readonly todoId = input.required<string>();
  private readonly todoId$ = toObservable(this.todoId);

  readonly todoForm = inject(FormBuilder).nonNullable.group({
    title: '',
    content: ''
  });

  private readonly saveStatus$ = merge(
    of('idle'),
    this.todoForm.valueChanges.pipe(
      debounceTime(200),
      tap(value => this.actions.dispatch(updateTodo({ id: this.todoId(), ...value }))),
      switchMap(() => this.todoRepository.getUpdateResultById$(this.todoId()).pipe(
        map(result => result.status)
      ))
    )
  );
  readonly saveStatus = toSignal(this.saveStatus$);

  ngOnInit(): void {
    this.listenForRefresh();
  }

  private listenForRefresh() {
    // user clicked the refresh button
    const refresh$ = this.shellService.refresh$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.todoRepository.allTodos$.pipe(
          take(1) // only take the latest slice of the state right after the refresh request succeeded
        )),
        map(todos => todos.find(t => t.id === this.todoId())),
        filter(todo => !!todo)
      );

    // user navigated to other todo
    const navigate$ = this.todoId$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(id => this.todoRepository.getTodoById$(id).pipe(
          take(1) // prevents the todoForm from being set all over again
        )),
        filter(todo => !!todo)
      );

    merge(refresh$, navigate$)
      .subscribe(todo => {
        this.pageTitle.setTitle(`Todo: ${todo.title}`);
        this.todoForm.patchValue(todo, { emitEvent: false });
      });
  }
}
