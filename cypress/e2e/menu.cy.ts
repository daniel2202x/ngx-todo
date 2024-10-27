describe('Menu', () => {

    beforeEach(() => {
        cy.createTestUser();
    });

    it('gets opened and closed', () => {
        cy.visit('/todos')
        cy.getBySel('menu-open').click();
        cy.contains('Hello').should('exist');
        cy.getBySel('menu-close').click();
        cy.contains('Hello').should('not.exist');
    });

});