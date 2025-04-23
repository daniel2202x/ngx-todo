describe('Drag & Drop', () => {

    beforeEach(() => {
        cy.createTestUser();
    });

    it('creates todos, edits some of them and then sorts them', () => {
        cy.visit('/todos');

        // create todos
        cy.createTodo('Todo1Title', 'Todo1Content');
        cy.createTodo('Todo2Title', 'Todo2Content');
        cy.createTodo('Todo3Title', 'Todo3Content');
        cy.createTodo('Todo4Title', 'Todo4Content');
        cy.createTodo('Todo5Title', 'Todo5Content');

        // navigate back to overview and assert order
        cy.goBackToOverview();
        cy.getBySel('todo-title').invoke('text').should('eq', 'Todo5TitleTodo4TitleTodo3TitleTodo2TitleTodo1Title');
        cy.getBySel('todo-content').invoke('text').should('eq', ' Todo5Content  Todo4Content  Todo3Content  Todo2Content  Todo1Content ');

        // edit third todo
        cy.contains('Todo3Title').click();
        cy.getBySel('todo-content-input').type('Edited');
        cy.waitUntilTodoSaved();
        cy.goBackToOverview();

        // edit fifth todo
        cy.contains('Todo5Title').click();
        cy.getBySel('todo-content-input').type('Edited');
        cy.waitUntilTodoSaved();
        cy.goBackToOverview();

        // assert order
        cy.getBySel('todo-title').invoke('text').should('eq', 'Todo5TitleTodo4TitleTodo3TitleTodo2TitleTodo1Title');
        cy.getBySel('todo-content').invoke('text').should('eq', ' Todo5ContentEdited  Todo4Content  Todo3ContentEdited  Todo2Content  Todo1Content ');

        // drag and drop second todo
        cy.getBySel('drag-handle-3')
            .trigger('mousedown', { button: 0, bubbles: true })
            .trigger('mousemove', { pageX: 100, pageY: 100 });
        cy.wait(1000);
        cy.getBySel('drop-container')
            .trigger('mousemove', { pageX: 100, pageY: 200 })
            .trigger('mouseup', { button: 0, bubbles: true });;
        cy.wait(1000);
        cy.getBySel('save-drag-spinner').should('not.exist');
        cy.wait(1000);

        // assert order
        cy.getBySel('todo-title').invoke('text').should('eq', 'Todo2TitleTodo5TitleTodo4TitleTodo3TitleTodo1Title');
        cy.getBySel('todo-content').invoke('text').should('eq', ' Todo2Content  Todo5ContentEdited  Todo4Content  Todo3ContentEdited  Todo1Content ');

        // drag and drop fifth todo
        cy.getBySel('drag-handle-1')
            .trigger('mousedown', { button: 0, bubbles: true })
            .trigger('mousemove', { pageX: 100, pageY: 100 });
        cy.wait(1000);
        cy.getBySel('drop-container')
            .trigger('mousemove', { pageX: 100, pageY: 600 })
            .trigger('mouseup', { button: 0, bubbles: true });;
        cy.wait(1000);
        cy.getBySel('save-drag-spinner').should('not.exist');

        // assert order
        cy.getBySel('todo-title').invoke('text').should('eq', 'Todo2TitleTodo4TitleTodo3TitleTodo1TitleTodo5Title');
        cy.getBySel('todo-content').invoke('text').should('eq', ' Todo2Content  Todo4Content  Todo3ContentEdited  Todo1Content  Todo5ContentEdited ');
    });


});