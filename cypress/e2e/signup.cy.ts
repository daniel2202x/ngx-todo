describe('User', () => {

  it('creates account', () => {
    cy.visit('/auth/signup');
    cy.getBySel('display-name').type('John');
    cy.getBySel('email').type(`john.doe${Date.now()}@example.com`);
    cy.getBySel('password').type('123456');
    cy.getBySel('password-repeated').type('123456{enter}');
    cy.url().should('contain', '/todos');
    cy.getBySel('menu-open').click();
    cy.contains('John').should('exist');
  });

  it('creates account with existing email', () => {
    cy.createTestUser(false).then(() => {
      cy.visit('/auth/signup');
      cy.getBySel('display-name').type('John');
      cy.getBySel('email').type(Cypress.env('currentUserEmail'));
      cy.getBySel('password').type('123456');
      cy.getBySel('password-repeated').type('123456{enter}');
      cy.contains('The email already exists').should('exist');
    });
  });

});