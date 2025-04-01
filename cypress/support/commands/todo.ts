/// <reference types="cypress" />

export { };

declare global {
    namespace Cypress {
        interface Chainable {
            createTodo(title: string | null, content: string | null): Chainable<any>;
        }
    }
}

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

        cy.wait(100);
        cy.contains('Saving...').should('not.exist');
        cy.contains('Saved').should('exist');
    }
});