import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Todo } from '@app/models';
import { MultiLineAbbreviationPipe } from '@app/pipes';
import { IconComponent, SpinnerDirective } from '@app/directives';

@Component({
  selector: 'app-todo-summary',
  standalone: true,
  imports: [MultiLineAbbreviationPipe, RouterLink, SpinnerDirective, IconComponent],
  templateUrl: './todo-summary.component.html',
  styleUrl: './todo-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoSummaryComponent {
  readonly todo = input.required<Todo>();

  readonly deleted = output<string>();

  readonly isDeleting = signal(false);

  deleteTodo(event: Event) {
    event.stopPropagation();
    this.isDeleting.set(true);
    this.deleted.emit(this.todo().id);
  }
}
