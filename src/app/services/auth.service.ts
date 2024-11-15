import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { getRegistry } from '@ngneat/elf';

import { map, switchMap, tap } from 'rxjs';

import { Credentials, AuthResponse, ProfileLookupResponse, RefreshResponse, SignupCredentials } from '@app/models';
import { environment } from '@app/environment';
import { AuthRepository } from '@app/state';

const baseUrl = '/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly authRepository = inject(AuthRepository);

  login(credentials: Credentials) {
    return this.http.post<AuthResponse>(
      environment.rootUrl + baseUrl + '/login',
      {
        ...credentials,
        returnSecureToken: true
      }
    );
  }

  lookupProfile() {
    return this.http.post<ProfileLookupResponse>(
      environment.rootUrl + baseUrl + '/lookup-profile',
      {
        idToken: this.authRepository.getValue().idToken
      }
    );
  }

  signup(credentials: SignupCredentials) {
    return this.http.post<AuthResponse>(environment.rootUrl + baseUrl + '/signup', { ...credentials, returnSecureToken: true })
      .pipe(
        switchMap(signupRes => this.updateProfile(credentials.displayName, signupRes.idToken).pipe(map(() => signupRes))),
        tap(signupRes => {
          this.authRepository.update({
            idToken: signupRes.idToken,
            refreshToken: signupRes.refreshToken,
            email: credentials.email,
            userId: signupRes.localId,
            displayName: credentials.displayName
          });
        })
      );
  }

  updateProfile(displayName: string, idToken: string) {
    return this.http.post(
      environment.rootUrl + baseUrl + '/update-profile',
      {
        displayName, idToken, returnSecureToken: false
      }
    );
  }

  logout(sessionExpired = false) {
    getRegistry().forEach(store => store.destroy());

    const queryParams = sessionExpired ? { sessionExpired: true } : {};
    this.router.navigate(['/', 'login'], { queryParams });
  }

  getRefreshToken() {
    return this.http.post<RefreshResponse>(
      environment.rootUrl + baseUrl + '/refresh',
      {
        grant_type: 'refresh_token',
        refresh_token: this.authRepository.getValue().refreshToken
      }
    );
  }
}
