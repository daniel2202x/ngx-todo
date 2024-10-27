describe('User', () => {

  beforeEach(() => {
    cy.createTestUser(false);
  });

  it('logs in', () => {
    cy.visit('/login')
    cy.getBySel('email').type(Cypress.env('currentUserEmail'));
    cy.getBySel('password').type(`${Cypress.env('currentUserPassword')}{enter}`);
    cy.url().should('contain', '/todos');
  });

  it('logs in using invalid credentials', () => {
    cy.visit('/login')
    cy.getBySel('email').type('john.doe@example.com');
    cy.getBySel('password').type('asdf{enter}');
    cy.contains('Invalid email or password').should('exist');
  });

});