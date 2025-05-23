/// <reference types="cypress" />

export { };

declare global {
    namespace Cypress {
        interface Chainable {
            createTestUser(fillLocalStorage?: boolean): Chainable<any>;
        }
    }
}

Cypress.Commands.add('createTestUser', (fillLocalStorage = true) => {
    const email = `john.doe${Date.now()}@example.com`;
    const password = Math.random().toString();

    Cypress.env('currentUserEmail', email);
    Cypress.env('currentUserPassword', password);

    return cy.request('POST', '/api/auth/signup',
        {
            email,
            password,
            returnSecureToken: true
        })
        .its('body')
        .then(res => {
            Cypress.env('currentUserIDToken', res.idToken);
            Cypress.env('currentUserUID', res.localId);

            if (fillLocalStorage) {
                cy.window().then(win => {
                    win.localStorage.setItem('auth', JSON.stringify({
                        idToken: res.idToken,
                        refreshToken: res.refreshToken,
                        email,
                        userId: res.localId,
                        displayName: ''
                    }));
                });
            }
        });
});
