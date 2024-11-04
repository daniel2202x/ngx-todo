import { Injectable } from '@angular/core';

import { createStore } from '@ngneat/elf';
import { addEntities, deleteEntities, getAllEntities, selectAllEntities, selectEntity, setEntities, updateAllEntities, updateEntities, withEntities } from '@ngneat/elf-entities';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';

import { GetTodo } from '@app/models';

const todosStore = createStore(
    { name: 'todos' },
    withEntities<GetTodo>()
);

persistState(todosStore, {
    key: 'todos',
    storage: localStorageStrategy,
});

@Injectable({ providedIn: 'root' })
export class TodoRepository {
    readonly allTodos$ = todosStore.pipe(selectAllEntities());

    getById$(id: string) {
        return todosStore.pipe(selectEntity(id));
    }

    setAll(todos: GetTodo[]) {
        todosStore.update(setEntities(todos));
    }

    add(todo: GetTodo) {
        todosStore.update(addEntities(todo));
    }

    update(todo: GetTodo) {
        todosStore.update(updateEntities(todo.id, todo));
    }

    updatePositions(newOrder: GetTodo[]) {
        todosStore.update(updateAllEntities(todo => ({ ...todo, position: newOrder.indexOf(todo) + 1 })));
        return todosStore.query(getAllEntities());
    }

    delete(id: string) {
        todosStore.update(deleteEntities(id));
    }
}