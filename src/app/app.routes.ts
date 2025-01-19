import { Routes } from '@angular/router';

import { authGuard } from '@app/guards';
import { noAuthGuard } from '@app/guards';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth/login'
    },
    {
        path: 'auth',
        canActivateChild: [authGuard],
        loadComponent: () => import('./components/auth/auth-shell/auth-shell.component').then(c => c.AuthShellComponent),
        children: [
            {
                path: 'login',
                title: $localize`Login`,
                loadComponent: () => import('./components/auth/login/login.component').then(c => c.LoginComponent)
            },
            {
                path: 'signup',
                title: $localize`Signup`,
                loadComponent: () => import('./components/auth/signup/signup.component').then(c => c.SignupComponent)
            }
        ]
    },
    {
        path: 'install',
        children: [
            {
                path: 'android',
                title: $localize`Installation on Android`,
                loadComponent: () => import('./components/install/android-install-instructions/android-install-instructions.component').then(c => c.AndroidInstallInstructionsComponent)
            },
            {
                path: 'ios',
                title: $localize`Installation on iOS`,
                loadComponent: () => import('./components/install/ios-install-instructions/ios-install-instructions.component').then(c => c.IosInstallInstructionsComponent)
            }
        ]
    },
    {
        path: 'todos',
        canActivateChild: [noAuthGuard],
        loadComponent: () => import('./components/todos/todo-overview-shell/todo-overview-shell.component').then(c => c.TodoOverviewShellComponent),
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
        loadComponent: () => import('./components/common/not-found/not-found.component').then(c => c.NotFoundComponent)
    }
];
