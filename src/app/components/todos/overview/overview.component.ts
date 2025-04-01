import { ChangeDetectionStrategy, Component, inject, OnInit, signal, } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { animate, style, transition, trigger } from '@angular/animations';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { RouterOutlet } from '@angular/router';

import { map, Subject, switchMap } from 'rxjs';

import { Actions } from '@ngneat/effects-ng';

import { Todo } from '@app/models';
import { SpinnerDirective } from '@app/directives';
import { TodoSummaryComponent } from '@app/components';
import { TodoRepository } from '@app/state';
import { deleteTodo, loadTodos, updateTodoPositions } from '@app/actions';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [TodoSummaryComponent, ReactiveFormsModule, FormsModule, SpinnerDirective, CdkDropList, CdkDrag, CdkDragHandle, RouterOutlet, AsyncPipe],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('todoDeleteSlideOut', [
      transition(':leave', [
        animate('300ms', style({ left: '100%', opacity: 0 })),
        animate('150ms', style({ height: 0 }))
      ])
    ])
  ]
})
export class OverviewComponent implements OnInit {

  private readonly todoRepository = inject(TodoRepository);
  private readonly actions = inject(Actions);

  readonly todosReversed$ = this.todoRepository.allTodos$.pipe(map(todos => todos.slice().sort((a, b) => b.position - a.position)));

  readonly searchString = signal('');
  private readonly searchString$ = toObservable(this.searchString);
  readonly todosToDisplay$ = this.searchString$.pipe(switchMap(search => this.todoRepository.filterFullText$(search)));

  readonly isLoading$ = this.todoRepository.fetchAllResult$.pipe(map(result => result.isLoading));

  private readonly positionChanged$ = new Subject<string>();
  readonly positionUpdatesLoading$ = this.positionChanged$.pipe(
    switchMap(todoId => this.todoRepository.getPositionUpdateResult$().pipe(
      map(({ isLoading }) => isLoading ? todoId : null)
    ))
  );

  ngOnInit(): void {
    this.actions.dispatch(loadTodos());
  }

  deleteTodo(id: string) {
    this.actions.dispatch(deleteTodo({ id }));
  }

  drop(event: CdkDragDrop<Todo[] | null, Todo[] | null, Todo>) {
    if (event.container.data) {
      const sortedTodos = event.container.data.slice();
      moveItemInArray(sortedTodos, event.previousIndex, event.currentIndex);
      const newOrder = sortedTodos.reverse().map(t => t.id);
      this.actions.dispatch(updateTodoPositions({ newOrder }));

      this.positionChanged$.next(event.item.data.id);
    }
  }
}
