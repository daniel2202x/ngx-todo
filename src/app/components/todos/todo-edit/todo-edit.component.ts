import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { debounceTime, filter, switchMap, tap } from 'rxjs';

import { TodoService } from '@app/services';
import { IconComponent, BootstrapValidationDirective } from '@app/directives';
import { TodoRepository } from '@app/state';

@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, BootstrapValidationDirective, IconComponent],
  templateUrl: './todo-edit.component.html',
  styleUrl: './todo-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoEditComponent implements OnInit {

  private readonly todoService = inject(TodoService);
  private readonly pageTitle = inject(Title);
  private readonly destroyRef = inject(DestroyRef);
  private readonly todoRepository = inject(TodoRepository);

  readonly todoId = input.required<string>();
  private readonly todoId$ = toObservable(this.todoId);

  readonly todoForm = inject(FormBuilder).nonNullable.group({
    title: '',
    content: ''
  });

  readonly saveStatus = signal<'saved' | 'unsaved' | 'saving'>('saved');

  ngOnInit(): void {
    this.loadTodoFromStore();
    this.listenFormChanges();
  }

  private loadTodoFromStore() {
    this.todoId$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(id => this.todoRepository.getById$(id)),
        filter(todo => !!todo)
      )
      .subscribe(todo => {
        this.setPageTitle(todo.title);
        this.todoForm.patchValue(todo, { emitEvent: false });
      });
  }

  private listenFormChanges() {
    this.todoForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.saveStatus.set('unsaved')),
        debounceTime(200),
        tap(() => this.saveStatus.set('saving')),
        switchMap((value) => this.todoService.updateTodo(this.todoId(), value)),
        tap((todo) => this.setPageTitle(todo.title))
      )
      .subscribe(() => this.saveStatus.set('saved'));
  }

  private setPageTitle(title: string) {
    this.pageTitle.setTitle(`Todo: ${title}`);
  }
}
