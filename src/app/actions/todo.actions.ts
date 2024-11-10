import { Todo } from '@app/models';
import { actionsFactory, props } from '@ngneat/effects';

const todoActions = actionsFactory('todo');

export const createTodo = todoActions.create('Create Todo');
export const loadTodos = todoActions.create('Load Todos');
export const updateTodo = todoActions.create('Update Todo', props<{ id: string } & Partial<Todo>>());
export const updateTodoPositions = todoActions.create('Update Todo Positions', props<{ newOrder: string[] }>());
export const deleteTodo = todoActions.create('Delete Todo', props<{ id: string }>());