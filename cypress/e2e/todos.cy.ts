describe('Todo handling', () => {

    beforeEach(() => {
        cy.createTestUser();
    });

    it('creates single line todo', () => {
        cy.visit('/todos');

        // type todo data
        cy.getBySel('add-todo').click();
        cy.getBySel('todo-title-input').type('Learn more Angular');
        cy.getBySel('todo-content-input').type('including testing & vite');

        // wait for save chain to complete
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');

        // navigate back to overview and assert
        cy.getBySel('back').click();
        cy.contains('Learn more Angular').should('exist');
        cy.contains('including testing & vite').should('exist');
        cy.contains('...').should('not.exist');
    });

    it('creates multi line todo', () => {
        cy.visit('/todos');

        // type todo data
        cy.getBySel('add-todo').click();
        cy.getBySel('todo-title-input').type('Learn');
        cy.getBySel('todo-content-input').type('- more angular\n- rust\n- go');

        // wait for save chain to complete
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');

        // navigate back to overview and assert
        cy.getBySel('back').click();
        cy.contains('Learn').should('exist');
        cy.contains('- more angular...').should('exist');
    });

    it('creates todo and creates another one right after', () => {
        cy.visit('/todos');

        // create first todo
        cy.getBySel('add-todo').click();
        cy.getBySel('todo-title-input').type('Todo 1 Title');
        cy.getBySel('todo-content-input').type('Todo 1 Content');
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');

        // create second todo
        cy.getBySel('add-todo').click();
        cy.getBySel('todo-title-input').should('have.value', '');
        cy.getBySel('todo-title-input').type('Todo 2 Title');
        cy.getBySel('todo-content-input').type('Todo 2 Content');
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');

        // navigate back to overview and assert
        cy.getBySel('back').click();
        cy.contains('Todo 1 Title').should('have.length', 1);
        cy.contains('Todo 1 Content').should('have.length', 1);
        cy.contains('Todo 2 Title').should('have.length', 1);
        cy.contains('Todo 2 Content').should('have.length', 1);
    });

    it('creates todos, edits some of them and then sorts them', () => {
        cy.visit('/todos');

        // create first todo
        cy.getBySel('add-todo').click();
        cy.getBySel('todo-title-input').type('Todo1Title');
        cy.getBySel('todo-content-input').type('Todo1Content');
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');

        // create second todo
        cy.getBySel('add-todo').click();
        cy.getBySel('todo-title-input').should('have.value', '');
        cy.getBySel('todo-title-input').type('Todo2Title');
        cy.getBySel('todo-content-input').type('Todo2Content');
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');

        // create third todo
        cy.getBySel('add-todo').click();
        cy.getBySel('todo-title-input').should('have.value', '');
        cy.getBySel('todo-title-input').type('Todo3Title');
        cy.getBySel('todo-content-input').type('Todo3Content');
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');

        // create fourth todo
        cy.getBySel('add-todo').click();
        cy.getBySel('todo-title-input').should('have.value', '');
        cy.getBySel('todo-title-input').type('Todo4Title');
        cy.getBySel('todo-content-input').type('Todo4Content');
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');

        // create fifth todo
        cy.getBySel('add-todo').click();
        cy.getBySel('todo-title-input').should('have.value', '');
        cy.getBySel('todo-title-input').type('Todo5Title');
        cy.getBySel('todo-content-input').type('Todo5Content');
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');

        // navigate back to overview and assert order
        cy.getBySel('back').click();
        cy.getBySel('todo-title').invoke('text').should('eq', 'Todo5TitleTodo4TitleTodo3TitleTodo2TitleTodo1Title');
        cy.getBySel('todo-content').invoke('text').should('eq', ' Todo5Content  Todo4Content  Todo3Content  Todo2Content  Todo1Content ');

        // edit third todo
        cy.contains('Todo3Title').click();
        cy.getBySel('todo-content-input').type('Edited');
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');
        cy.getBySel('back').click();

        // edit fifth todo
        cy.contains('Todo5Title').click();
        cy.getBySel('todo-content-input').type('Edited');
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');
        cy.getBySel('back').click();

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

    it('edits todo', () => {
        cy.visit('/todos');

        // create todo
        cy.getBySel('add-todo').click();
        cy.getBySel('todo-title-input').type('Learn');
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');

        // navigate back to overview and open again
        cy.getBySel('back').click();
        cy.contains('Learn').should('exist');
        cy.contains('Learn').click();

        // edit todo
        cy.getBySel('todo-content-input').type('Angular & more');
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');

        // navigate back to overview and assert
        cy.getBySel('back').click();
        cy.contains('Angular & more').should('exist');
    });

    it('deletes todo', () => {
        cy.visit('/todos');

        // create todo
        cy.getBySel('add-todo').click();
        cy.getBySel('todo-title-input').type('Learn Angular');
        cy.contains('Saving...').should('exist');
        cy.contains('Saved').should('exist');

        // navigate back to overview and check for existence
        cy.getBySel('back').click();
        cy.contains('Learn Angular').should('exist');

        // delete and check if it doesn't exist anymore
        cy.getBySel('delete-todo').click();
        cy.contains('Learn Angular').should('not.exist');
    });

    it('refreshes list', () => {
        cy.visit('/todos');

        // shouldn't exist on first visit
        cy.contains('Learn').should('not.exist');
        cy.contains('Angular').should('not.exist');

        // create todo manually using the backend
        cy.request({
            method: 'POST',
            url: `/api/users/${Cypress.env('currentUserUID')}/todos`,
            headers: { Authorization: `Bearer ${Cypress.env('currentUserIDToken')}` },
            body: { fields: { title: { stringValue: 'Learn' }, content: { stringValue: 'Angular' } } }
        });

        // click refresh button and check for existence
        cy.getBySel('menu-open').click();
        cy.getBySel('refresh-list').click();
        cy.contains('Learn').should('exist');
        cy.contains('Angular').should('exist');
    });

});