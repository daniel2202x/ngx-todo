describe('App', () => {

    context('gets called on /', () => {
        it('without idToken and refreshToken', () => {
            cy.visit('/');
            cy.url().should('contain', '/login');
        });

        it('with valid idToken and valid refreshToken', () => {
            cy.createTestUser();
            cy.visit('/');
            cy.url().should('contain', '/todos');
        });
    });

    context('gets called on /login', () => {
        it('without idToken and refreshToken', () => {
            cy.visit('/login');
            cy.url().should('contain', '/login');
        });

        it('with valid idToken and valid refreshToken', () => {
            cy.createTestUser();
            cy.visit('/login');
            cy.url().should('contain', '/todos');
        });
    });

    context('gets called on /todos', () => {
        it('without idToken and refreshToken', () => {
            cy.visit('/todos');
            cy.url().should('contain', '/login');
        });

        it('with valid idToken and valid refreshToken', () => {
            cy.createTestUser();
            cy.visit('/todos');
            cy.url().should('contain', '/todos');
        });
    });

});