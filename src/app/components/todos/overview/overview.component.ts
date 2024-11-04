import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal, } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { animate, style, transition, trigger } from '@angular/animations';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

import { filter, forkJoin, map } from 'rxjs';

import { GetTodo } from '@app/models';
import { SpinnerDirective, BootstrapValidationDirective } from '@app/directives';
import { TodoService } from '@app/services';
import { TodoSummaryComponent } from '@app/components';
import { TodoRepository } from '@app/state';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [TodoSummaryComponent, ReactiveFormsModule, FormsModule, BootstrapValidationDirective, SpinnerDirective, CdkDropList, CdkDrag, CdkDragHandle, RouterOutlet, AsyncPipe],
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

  private readonly todoService = inject(TodoService);
  private readonly todoRepository = inject(TodoRepository);

  private readonly destroyRef = inject(DestroyRef);

  private readonly router = inject(Router);

  private readonly todos = toSignal(this.todoRepository.allTodos$);
  readonly todosReversed = computed(() => this.todos()?.slice().sort((a, b) => b.position - a.position));

  readonly searchString = signal('');
  readonly todosToDisplay = computed(() => this.todos()?.filter(todo => (todo.title || '').toLowerCase().includes(this.searchString().toLowerCase())
    || (todo.content || '').toLowerCase().includes(this.searchString().toLowerCase()))
  );

  readonly initiallyLoading = signal(true);

  readonly todoMoving = signal<string | null>(null);

  // handling views on different routes based on screen size involves observing both the screen width and where the navigation currently is
  readonly isLargeScreen$ = inject(BreakpointObserver).observe('(min-width: 768px)').pipe(map(result => result.matches));
  readonly isOnOverviewPage = signal(this.router.url.endsWith('todos')); // has to be set initially and everytime the router navigates (see ngOnInit)

  ngOnInit(): void {
    this.todoService.refreshAll()
      .subscribe(() => this.initiallyLoading.set(false));

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
    this.todoService.deleteTodo(id)
      .subscribe();
  }

  drop(event: CdkDragDrop<GetTodo[] | undefined, GetTodo[], GetTodo>) {
    const sortedTodos = event.container.data?.slice();
    if (sortedTodos) {
      moveItemInArray(sortedTodos, event.previousIndex, event.currentIndex);

      // optimistic update
      const updatedTodos = this.todoRepository.updatePositions(sortedTodos.reverse());

      this.todoMoving.set(event.item.data.id);
      forkJoin(updatedTodos.map(todo => this.todoService.updateTodo(todo.id, { position: todo.position })))
        .subscribe(() => this.todoMoving.set(null));
    }
  }
}
