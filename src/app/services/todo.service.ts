import { inject, Injectable } from '@angular/core';

import { ApiService } from '@app/services';
import { Todo } from '@app/models';
import { AuthRepository } from '@app/state';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private readonly api = inject(ApiService);
  private readonly authRepository = inject(AuthRepository);

  postTodo(todo: Omit<Todo, 'id'>) {
    return this.api.post<Todo>(`/users/${this.getUserId()}/todos`, todo);
  }

  getAllTodos() {
    return this.api.getMany<Todo>(`/users/${this.getUserId()}/todos`);
  }

  patchTodo(id: string, todo: Partial<Todo>) {
    return this.api.patch<Todo>(`/users/${this.getUserId()}/todos/${id}`, todo);
  }

  deleteTodo(id: string) {
    return this.api.delete(`/users/${this.getUserId()}/todos/${id}`);
  }

  private getUserId() {
    return this.authRepository.getValue().userId;
  }
}
