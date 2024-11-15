import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { createEffect, ofType, tapResult } from '@ngneat/effects';
import { trackRequestResult } from '@ngneat/elf-requests';

import { map, switchMap, tap } from 'rxjs';

import { login, signup } from '@app/actions';
import { AuthService } from '@app/services';
import { AuthRepository } from '@app/state';

@Injectable({ providedIn: 'root' })
export class AuthEffects {
    private readonly authService = inject(AuthService);
    private readonly authRepository = inject(AuthRepository);

    private readonly router = inject(Router);

    readonly login$ = createEffect(actions => actions.pipe(
        ofType(login),
        switchMap(credentials => this.authService.login(credentials).pipe(
            trackRequestResult(['login'], { skipCache: true }),
            tapResult(authRes => {
                this.authRepository.setCredentials(credentials.email, authRes.localId);
                this.authRepository.setTokens(authRes.idToken, authRes.refreshToken);
            })
        )),
        tap(() => this.router.navigateByUrl('/todos')),
        switchMap(() => this.authService.lookupProfile().pipe(
            tapResult(profileRes => this.authRepository.setDisplayName(profileRes.users[0].displayName))
        ))
    ));

    readonly signup$ = createEffect(actions => actions.pipe(
        ofType(signup),
        switchMap(credentials => this.authService.signup(credentials).pipe(
            trackRequestResult(['signup'], { skipCache: true }),
            tapResult(authRes => {
                this.authRepository.setCredentials(credentials.email, authRes.localId);
                this.authRepository.setTokens(authRes.idToken, authRes.refreshToken);
            }),
            map(() => credentials)
        )),
        tap(() => this.router.navigateByUrl('/todos')),
        switchMap(credentials => this.authService.updateProfile(credentials.displayName).pipe(
            tapResult(() => this.authRepository.setDisplayName(credentials.displayName))
        ))
    ));
}