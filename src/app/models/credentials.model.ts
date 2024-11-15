export interface Credentials {
    email: string;
    password: string;
}

export interface SignupCredentials extends Credentials {
    displayName: string;
}