import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { getRegistry } from '@ngneat/elf';

import { Credentials, AuthResponse, ProfileLookupResponse, RefreshResponse, SignupCredentials } from '@app/models';
import { AuthRepository } from '@app/state';

const baseUrl = '/api/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly authRepository = inject(AuthRepository);

  login(credentials: Credentials) {
    return this.http.post<AuthResponse>(
      baseUrl + '/login',
      {
        ...credentials,
        returnSecureToken: true
      }
    );
  }

  lookupProfile() {
    return this.http.post<ProfileLookupResponse>(
      baseUrl + '/lookup-profile',
      {
        idToken: this.authRepository.getValue().idToken
      }
    );
  }

  signup(credentials: SignupCredentials) {
    return this.http.post<AuthResponse>(
      baseUrl + '/signup',
      {
        ...credentials,
        returnSecureToken: true
      }
    );
  }

  updateProfile(displayName: string) {
    return this.http.post(
      baseUrl + '/update-profile',
      {
        displayName,
        idToken: this.authRepository.getValue().idToken,
        returnSecureToken: false
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
      baseUrl + '/refresh',
      {
        grant_type: 'refresh_token',
        refresh_token: this.authRepository.getValue().refreshToken
      }
    );
  }
}
