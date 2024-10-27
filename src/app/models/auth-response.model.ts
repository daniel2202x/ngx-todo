export interface AuthResponse {
    idToken: string;
    refreshToken: string;
    localId: string;
}

export interface User {
    displayName: string;
}

export interface ProfileLookupResponse {
    users: User[];
}

export interface RefreshResponse {
    id_token: string;
    refresh_token: string;
}