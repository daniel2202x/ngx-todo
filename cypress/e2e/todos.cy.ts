describe('Todo handling', () => {

    beforeEach(() => {
        cy.createTestUser();
    });

    it('creates single line todo', () => {
        cy.visit('/todos');

        cy.createTodo('My Todo Title', 'My Todo Content');
        cy.goBackToOverview();
        cy.contains('My Todo Title').should('exist');
        cy.contains('My Todo Content').should('exist');
        cy.contains('...').should('not.exist');
    });

    it('creates multi line todo', () => {
        cy.visit('/todos');

        cy.createTodo('My Todo Title', 'Line 1{enter}Line 2{enter}Line 3{enter}Line 4{enter}Line 5{enter}Line 6');
        cy.goBackToOverview();
        cy.contains('My Todo Title').should('exist');
        cy.contains('Line 5...').should('exist');
    });

    it('edits todo', () => {
        cy.visit('/todos');

        // create todo
        cy.createTodo('My Todo Title', null);

        // navigate back to overview and open again
        cy.goBackToOverview();
        cy.contains('My Todo Title').should('exist');
        cy.contains('My Todo Title').click();

        // edit todo
        cy.getBySel('todo-content-input').type('My Todo Content');
        cy.waitUntilTodoSaved();

        // navigate back to overview and assert
        cy.goBackToOverview();
        cy.contains('My Todo Title').should('exist');
        cy.contains('My Todo Content').should('exist');

        // reload page and assert again
        cy.reload();
        cy.contains('My Todo Title').should('exist');
        cy.contains('My Todo Content').should('exist');
    });

    it('deletes todo', () => {
        cy.visit('/todos');

        // create todo
        cy.createTodo('My Todo Title', 'My Todo Content');

        // navigate back to overview and check for existence
        cy.goBackToOverview();
        cy.contains('My Todo Title').should('exist');
        cy.contains('My Todo Content').should('exist');

        // delete and check if it doesn't exist anymore
        cy.getBySel('delete-todo').click();
        cy.contains('My Todo Title').should('not.exist');
        cy.contains('My Todo Content').should('not.exist');
    });

    it('refreshes list', () => {
        cy.visit('/todos');

        // shouldn't exist on first visit
        cy.contains('My Todo Title').should('not.exist');
        cy.contains('My Todo Content').should('not.exist');

        // create todo manually using the backend
        cy.request({
            method: 'POST',
            url: `/api/data/users/${Cypress.env('currentUserUID')}/todos`,
            headers: { Authorization: `Bearer ${Cypress.env('currentUserIDToken')}` },
            body: { fields: { title: { stringValue: 'My Todo Title' }, content: { stringValue: 'My Todo Content' } } }
        });

        // click refresh button and check for existence
        cy.getBySel('menu-open').click();
        cy.getBySel('refresh-list').click();
        cy.contains('My Todo Title').should('exist');
        cy.contains('My Todo Content').should('exist');
    });

});