import { inject, Injectable } from '@angular/core';

import { switchMap, take, tap } from 'rxjs';

import { ApiService } from '@app/services';
import { GetTodo, PostTodo, PatchTodo } from '@app/models';
import { AuthRepository, TodoRepository } from '@app/state';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private api = inject(ApiService);
  private authRepository = inject(AuthRepository);
  private todoRepository = inject(TodoRepository);

  refreshAll() {
    return this.api.getMany<GetTodo>(`/users/${this.getUserId()}/todos`)
      .pipe(tap(todos => this.todoRepository.setAll(todos)));
  }

  updateTodo(id: string, todo: Partial<PatchTodo>) {
    return this.api.patch<GetTodo>(`/users/${this.getUserId()}/todos/${id}`, todo)
      .pipe(tap(todo => this.todoRepository.update(todo)));
  }

  deleteTodo(id: string) {
    return this.api.delete(`/users/${this.getUserId()}/todos/${id}`)
      .pipe(tap(() => this.todoRepository.delete(id)));
  }

  createEmptyTodo() {
    return this.todoRepository.allTodos$
      .pipe(
        take(1),
        switchMap(todos => this.createTodo({
          title: '',
          content: '',
          position: todos?.length > 0 ? Math.max(...todos.map(t => t.position)) + 1 : 1
        })),
        tap(createdTodo => this.todoRepository.add(createdTodo))
      );
  }

  private createTodo(todo: PostTodo) {
    return this.api.post<GetTodo>(`/users/${this.getUserId()}/todos`, todo);
  }

  private getUserId() {
    return this.authRepository.getValue().userId;
  }
}
