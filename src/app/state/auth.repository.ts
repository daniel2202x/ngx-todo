import { Injectable } from '@angular/core';

import { createStore, select, withProps } from '@ngneat/elf';
import {
    persistState,
    localStorageStrategy,
} from '@ngneat/elf-persist-state';

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

    getValue() {
        return authStore.getValue();
    }

    update(auth: AuthProps) {
        authStore.update(() => auth);
    }

    updateTokens(idToken: string, refreshToken: string) {
        authStore.update(state => ({
            ...state,
            idToken,
            refreshToken
        }));
    }
}
