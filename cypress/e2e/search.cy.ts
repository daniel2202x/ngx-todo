describe('Full text search', () => {

    beforeEach(() => {
        cy.createTestUser();
    });

    it('searches multiple times', () => {
        cy.visit('/todos');

        // create todos
        cy.createTodo('Test123', 'Test');
        cy.createTodo('Test1234', 'Test');
        cy.createTodo('Test', 'Test123');
        cy.createTodo('Test', 'Test1234');
        cy.createTodo('Test456', 'Test');
        cy.createTodo('Test4567', 'Test');
        cy.createTodo('Test', 'Test456');
        cy.createTodo('Test', 'Test4567');

        // navigate back to overview and assert that all todos exist
        cy.getBySel('back').click();
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test123', 4);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test1234', 2);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test456', 4);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test4567', 2);

        // search for 'Test123'
        cy.getBySel('search-string').type('Test123');
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test123', 4);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test1234', 2);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test456', 0);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test4567', 0);

        // search for 'Test1234'
        cy.getBySel('search-string').type('4');
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test123', 2);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test1234', 2);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test456', 0);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test4567', 0);

        // search for 'Test'
        cy.getBySel('search-string').type('{backspace}{backspace}{backspace}{backspace}');
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test123', 4);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test1234', 2);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test456', 4);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test4567', 2);

        // search for 'Test456'
        cy.getBySel('search-string').type('456');
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test123', 0);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test1234', 0);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test456', 4);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test4567', 2);

        // search for 'Test4567'
        cy.getBySel('search-string').type('7');
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test123', 0);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test1234', 0);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test456', 2);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test4567', 2);

        // clear search
        cy.getBySel('search-string').clear();
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test123', 4);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test1234', 2);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test456', 4);
        cy.getBySel('todo-title', 'todo-content').containsTimes('Test4567', 2);
    });

});