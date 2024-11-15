import { actionsFactory, props } from '@ngneat/effects';

import { Credentials, SignupCredentials } from '@app/models';

const authActions = actionsFactory('auth');

export const login = authActions.create('Login', props<Credentials>());
export const signup = authActions.create('Signup', props<SignupCredentials>());