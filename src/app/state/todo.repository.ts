import { Injectable } from '@angular/core';

import { createStore } from '@ngneat/elf';
import { addEntities, deleteEntities, getAllEntities, selectAllEntities, selectEntity, setEntities, updateAllEntities, updateEntities, withEntities } from '@ngneat/elf-entities';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { joinRequestResult } from '@ngneat/elf-requests';

import { combineLatest, map } from 'rxjs';

import { Todo } from '@app/models';

const todoStore = createStore(
    { name: 'todos' },
    withEntities<Todo>()
);

persistState(todoStore, {
    key: 'todos',
    storage: localStorageStrategy,
});

@Injectable({ providedIn: 'root' })
export class TodoRepository {

    readonly allTodos$ = todoStore.pipe(selectAllEntities());

    readonly createTodoResult$ = todoStore.pipe(selectAllEntities(), joinRequestResult(['post-todo'], { initialStatus: 'idle' }));
    readonly fetchAllResult$ = todoStore.pipe(selectAllEntities(), joinRequestResult(['get-todos']));

    addTodo(todo: Todo) {
        todoStore.update(addEntities(todo));
    }

    setAllTodos(todos: Todo[]) {
        todoStore.update(setEntities(todos));
    }

    filterFullText$(searchString: string) {
        return this.allTodos$.pipe(
            map(todos => todos.filter(todo => todo.title.toLowerCase().includes(searchString.toLowerCase())
                || todo.content.toLowerCase().includes(searchString.toLowerCase())))
        )
    }

    getTodoById$(id: string) {
        return todoStore.pipe(selectEntity(id));
    }

    getMaxPosition() {
        const todos = todoStore.query(getAllEntities());
        return todos.length > 0 ? Math.max(...todos.map(todo => todo.position)) : 1;
    }

    updateTodo(id: string, todo: Partial<Todo>) {
        todoStore.update(updateEntities(id, todo));
    }

    updatePositions(newOrder: string[]) {
        todoStore.update(updateAllEntities(todo => ({ ...todo, position: newOrder.indexOf(todo.id) + 1 })));
        return todoStore.query(getAllEntities());
    }

    getUpdateResultById$(id: string) {
        return todoStore.pipe(selectEntity(id), joinRequestResult(['patch-todo', id]));
    }

    getPositionUpdateResult$() {
        const todos = todoStore.query(getAllEntities());
        return combineLatest(todos.map(todo => todoStore.pipe(
            selectEntity(todo.id),
            joinRequestResult([`patch-todo-position`, todo.id])
        )))
            .pipe(
                map(results => ({
                    isLoading: results.some(result => result.isLoading)
                }))
            );
    }

    deleteTodo(id: string) {
        todoStore.update(deleteEntities(id));
    }
}