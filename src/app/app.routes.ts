import { Routes } from '@angular/router';

import { authGuard } from '@app/guards';
import { noAuthGuard } from '@app/guards';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        title: $localize`Login`,
        canActivate: [authGuard],
        loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'signup',
        title: $localize`Signup`,
        canActivate: [authGuard],
        loadComponent: () => import('./components/signup/signup.component').then(c => c.SignupComponent)
    },
    {
        path: 'todos',
        canActivateChild: [noAuthGuard],
        loadComponent: () => import('./components/shell/shell.component').then(c => c.ShellComponent),
        children: [
            {
                path: '',
                title: 'NGX Todo',
                loadComponent: () => import('./components/todos/overview/overview.component').then(c => c.OverviewComponent),
                children: [
                    {
                        path: ':todoId',
                        title: $localize`Edit Todo`,
                        loadComponent: () => import('./components/todos/todo-edit/todo-edit.component').then(c => c.TodoEditComponent)
                    }
                ]
            }
        ]
    },
    {
        path: '**',
        title: 'Error 404 (Not Found)!!1',
        loadComponent: () => import('./components/not-found/not-found.component').then(c => c.NotFoundComponent)
    }
];
