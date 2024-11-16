import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { createEffect, ofType } from '@ngneat/effects';
import { trackRequestResult } from '@ngneat/elf-requests';

import { forkJoin, switchMap, tap } from 'rxjs';

import { TodoService } from '@app/services';
import { TodoRepository } from '@app/state';
import { createTodo, deleteTodo, loadTodos, updateTodo, updateTodoPositions } from '@app/actions';

@Injectable({ providedIn: 'root' })
export class TodoEffects {
    private readonly todoService = inject(TodoService);
    private readonly todoRepository = inject(TodoRepository);

    private readonly router = inject(Router);

    readonly createTodo$ = createEffect(actions => actions.pipe(
        ofType(createTodo),
        switchMap(() => this.todoService.postTodo({ title: '', content: '', position: this.todoRepository.getMaxPosition() + 1 }).pipe(
            tap(todo => this.todoRepository.addTodo(todo)),
            trackRequestResult(['post-todo'], { skipCache: true }),
            tap(todo => this.router.navigate(['todos', todo.id]))
        ))
    ));

    readonly loadTodos$ = createEffect(actions => actions.pipe(
        ofType(loadTodos),
        switchMap(() => this.todoService.getAllTodos().pipe(
            tap(todos => this.todoRepository.setAllTodos(todos)),
            trackRequestResult(['get-todos'], { skipCache: true })
        )),
    ));

    readonly updateTodo$ = createEffect(actions => actions.pipe(
        ofType(updateTodo),
        switchMap(todo => this.todoService.patchTodo(todo.id, todo).pipe(
            tap(todo => this.todoRepository.updateTodo(todo.id, todo)),
            trackRequestResult(['patch-todo', todo.id], { skipCache: true })
        ))
    ));

    readonly updateTodoPositions$ = createEffect(actions => actions.pipe(
        ofType(updateTodoPositions),
        switchMap(({ newOrder }) => {
            const updatedTodos = this.todoRepository.updatePositions(newOrder); // optimistic update first
            return forkJoin(updatedTodos.map(todo => this.todoService
                .patchTodo(todo.id, { position: todo.position })
                .pipe(
                    tap(todo => this.todoRepository.updateTodo(todo.id, { position: todo.position })), // persist position comming from server just to be safe
                    trackRequestResult([`patch-todo-position`, todo.id], { skipCache: true })
                )
            ));
        })
    ));

    readonly deleteTodo$ = createEffect(actions => actions.pipe(
        ofType(deleteTodo),
        switchMap(({ id }) => this.todoService.deleteTodo(id).pipe(
            tap(() => this.todoRepository.deleteTodo(id))
        ))
    ));

}