import { Injectable } from '@angular/core';

import { createStore, select, withProps } from '@ngneat/elf';
import { persistState, localStorageStrategy } from '@ngneat/elf-persist-state';
import { joinRequestResult } from '@ngneat/elf-requests';

export interface AuthProps {
    idToken: string;
    refreshToken: string;
    email: string;
    userId: string;
    displayName: string;
}

const authStore = createStore(
    { name: 'auth' },
    withProps<AuthProps>({ idToken: '', refreshToken: '', email: '', userId: '', displayName: '' })
);

persistState(authStore, {
    key: 'auth',
    storage: localStorageStrategy,
});

@Injectable({ providedIn: 'root' })
export class AuthRepository {
    readonly displayName$ = authStore.pipe(select(auth => auth.displayName));

    readonly loginResult$ = authStore.pipe(joinRequestResult(['login'], { initialStatus: 'idle' }));

    getValue() {
        return authStore.getValue();
    }

    update(auth: AuthProps) {
        authStore.update(() => auth);
    }

    setCredentials(email: string, userId: string) {
        authStore.update(state => ({
            ...state,
            email,
            userId
        }));
    }

    setTokens(idToken: string, refreshToken: string) {
        authStore.update(state => ({
            ...state,
            idToken,
            refreshToken
        }));
    }

    setDisplayName(displayName: string) {
        authStore.update(state => ({
            ...state,
            displayName
        }));
    }
}
