function login(){
    cy.get('input[name="Name"]').click().type('rub');
        cy.get('button').contains('Enter').click();
  
  }
  
describe('Create account', () => {
    beforeEach(function () {
        cy.request({method: 'PUT', url: 'http://localhost:3000/reset_database'});

        cy.visit('http://localhost:3000');

        login()
        cy.wait(500)

    });
    
    it('create poll', () => {
        cy.contains('button', 'Create poll').click();
        cy.get('input[placeholder="Question"]').type('alles goed?');
        cy.get('input[placeholder="Answer"]').eq(0).type('ja');
        cy.contains('button', 'Add answer').click();
        cy.get('input[placeholder="Answer"]').eq(1).type('nee');
        cy.contains('button', 'Save').click();
        cy.contains('p', 'alles goed?');
    });

    it('vote answer', () => {
        cy.get('.answer input[type="checkbox"]').eq(1).click();
        cy.get('.answer input[type="checkbox"]').eq(1).should('be.checked');
    });

    it('unvote answer', () => {
        cy.get('.answer input[type="checkbox"]').first().uncheck();
        cy.get('.answer input[type="checkbox"]').first().should('not.be.checked');   
    });

    it('delete poll', () => {
        cy.get('.material-icons').eq(0).click();
        cy.contains('p', 'Ga je mee?').should('not.exist');
    });
});

  