/// <reference types="cypress" />

export { };

declare global {
    namespace Cypress {
        interface Chainable {
            getBySel(...selectors: string[]): Chainable<JQuery<Node>>;
            containsTimes(str: string, times: number): Chainable<any>;
            goBackToOverview(): Chainable<any>;
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

Cypress.Commands.add('goBackToOverview', () => {
    cy.intercept('GET', '/api/data/users/*/todos').as('fetchTodos');
    cy.getBySel('back').click();
    cy.wait('@fetchTodos');
});
