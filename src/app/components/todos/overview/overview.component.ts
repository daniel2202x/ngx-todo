import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { animate, style, transition, trigger } from '@angular/animations';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

import { filter, map, Subject, switchMap } from 'rxjs';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly actions = inject(Actions);
  private readonly router = inject(Router);

  readonly todosReversed$ = this.todoRepository.allTodos$.pipe(map(todos => todos.slice().sort((a, b) => b.position - a.position)));

  readonly searchString = signal('');
  private readonly searchString$ = toObservable(this.searchString);
  readonly todosToDisplay$ = this.searchString$.pipe(switchMap(search => this.todoRepository.filterFullText$(search)));

  readonly isLoading$ = this.todoRepository.fetchResult$.pipe(map(result => result.isLoading));

  private readonly positionChanged$ = new Subject<string>();
  readonly positionUpdatesLoading$ = this.positionChanged$.pipe(
    switchMap(todoId => this.todoRepository.getPositionUpdateResult$().pipe(
      map(({ isLoading }) => isLoading ? todoId : null)
    ))
  );

  // handling views on different routes based on screen size involves observing both the screen width and where the navigation currently is
  readonly isLargeScreen$ = inject(BreakpointObserver).observe('(min-width: 768px)').pipe(map(result => result.matches));
  readonly isOnOverviewPage = signal(this.router.url.endsWith('todos')); // has to be set initially and everytime the router navigates (see ngOnInit)

  ngOnInit(): void {
    this.actions.dispatch(loadTodos());

    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        this.isOnOverviewPage.set(event.url.endsWith('todos'));
      });
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
