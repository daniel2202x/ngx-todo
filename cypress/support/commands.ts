/// <reference types="cypress" />

export { };

declare global {
    namespace Cypress {
        interface Chainable {
            getBySel(...selectors: string[]): Chainable<JQuery<Node>>;
            containsTimes(str: string, times: number): Chainable<any>;

            createTestUser(fillLocalStorage?: boolean): Chainable<any>;

            createTodo(title: string | null, content: string | null): Chainable<any>;
        }
    }
}

Cypress.Commands.add('getBySel', (...selectors: string[]) => {
    return cy.get(selectors.map(sel => `[data-cy=${sel}]`).join(', '));
});

Cypress.Commands.add('containsTimes', { prevSubject: 'element' }, (subject: JQuery<Node>, str: string, times: number) => {
    return cy.wrap(subject)
        .filter((index, el) => !Cypress.$(el).parents().hasClass('d-none'))
        .invoke('text')
        .then(text => {
            const matches = (text.match(new RegExp(str, 'g')) || []).length;
            expect(matches).to.equal(times);
        });
});

Cypress.Commands.add('createTestUser', (fillLocalStorage = true) => {
    const email = `john.doe${Date.now()}@example.com`;
    const password = Math.random().toString();

    Cypress.env('currentUserEmail', email);
    Cypress.env('currentUserPassword', password);

    return cy.request('POST', '/auth/signup',
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

Cypress.Commands.add('createTodo', (title: string | null, content: string | null) => {
    if (title || content) {
        cy.getBySel('add-todo').click();
        cy.getBySel('todo-title-input').should('have.value', '');

        if (title) {
            cy.getBySel('todo-title-input').type(title);
        }

        if (content) {
            cy.getBySel('todo-content-input').type(content);
        }

        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');
    }
});