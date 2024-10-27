describe('Language', () => {

    it('German gets chosen on login page', () => {
        cy.visit('/login')
        cy.contains('Login').should('exist');
        cy.getBySel('lang-de').click();
        cy.contains('Anmelden').should('exist');
    });

    it('German gets chosen on overview page', () => {
        cy.createTestUser();
        cy.visit('/todos')
        cy.contains('Nothing to do').should('exist');
        cy.getBySel('menu-open').click();
        cy.getBySel('lang-de').click();
        cy.contains('Nichts zu tun').should('exist');
    });

});