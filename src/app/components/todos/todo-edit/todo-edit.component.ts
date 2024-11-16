import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

import { debounceTime, filter, map, merge, of, switchMap, tap } from 'rxjs';

import { Actions } from '@ngneat/effects-ng';

import { IconComponent } from '@app/directives';
import { TodoRepository } from '@app/state';
import { updateTodo } from '@app/actions';

@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './todo-edit.component.html',
  styleUrl: './todo-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoEditComponent implements OnInit {

  private readonly pageTitle = inject(Title);
  private readonly destroyRef = inject(DestroyRef);
  private readonly todoRepository = inject(TodoRepository);
  private readonly actions = inject(Actions);
  private readonly router = inject(Router);

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
    this.loadTodoFromStore();
  }

  private loadTodoFromStore() {
    this.todoId$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(id => this.todoRepository.getTodoById$(id)),
        filter(todo => !!todo)
      )
      .subscribe(todo => {
        this.pageTitle.setTitle(`Todo: ${todo.title}`);
        this.todoForm.patchValue(todo, { emitEvent: false });
      });
  }

  goBack() {
    if (this.saveStatus() !== 'loading') {
      this.router.navigate(['..']);
    }
  }
}
