import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { getRegistry } from '@ngneat/elf';

import { map, switchMap, tap } from 'rxjs';

import { Credentials, AuthResponse, ProfileLookupResponse, RefreshResponse } from '@app/models';
import { environment } from '@app/environment';
import { AuthRepository } from '@app/state';

const baseUrl = '/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private authRepository = inject(AuthRepository);

  login(credentials: Credentials) {
    return this.http.post<AuthResponse>(environment.rootUrl + baseUrl + '/login', { ...credentials, returnSecureToken: true })
      .pipe(
        switchMap(loginRes => this.lookupProfile(loginRes.idToken).pipe(map(profileRes => ({ loginRes, profileRes })))),
        tap(({ loginRes, profileRes }) => {
          this.authRepository.update({
            idToken: loginRes.idToken,
            refreshToken: loginRes.refreshToken,
            email: credentials.email,
            userId: loginRes.localId,
            displayName: profileRes.users[0].displayName
          });
        })
      );
  }

  private lookupProfile(idToken: string) {
    return this.http.post<ProfileLookupResponse>(environment.rootUrl + baseUrl + '/lookup-profile', { idToken });
  }

  signup(credentials: Credentials, displayName: string) {
    return this.http.post<AuthResponse>(environment.rootUrl + baseUrl + '/signup', { ...credentials, returnSecureToken: true })
      .pipe(
        switchMap(signupRes => this.updateProfile(displayName, signupRes.idToken).pipe(map(() => signupRes))),
        tap(signupRes => {
          this.authRepository.update({
            idToken: signupRes.idToken,
            refreshToken: signupRes.refreshToken,
            email: credentials.email,
            userId: signupRes.localId,
            displayName
          });
        })
      );
  }

  private updateProfile(displayName: string, idToken: string) {
    return this.http.post(environment.rootUrl + baseUrl + '/update-profile', { displayName, idToken, returnSecureToken: false });
  }

  logout(sessionExpired = false) {
    getRegistry().forEach(store => store.destroy());

    const queryParams = sessionExpired ? { sessionExpired: true } : {};
    this.router.navigate(['/', 'login'], { queryParams });
  }

  refresh() {
    return this.http.post<RefreshResponse>(
      environment.rootUrl + baseUrl + '/refresh',
      { grant_type: 'refresh_token', refresh_token: this.authRepository.getValue().refreshToken })
      .pipe(tap(res => {
        this.authRepository.updateTokens(res.id_token, res.refresh_token);
      }));
  }
}
