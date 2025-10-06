describe("Polls", function() {
    beforeEach(function () {
        cy.request({method: 'PUT', url: 'http://localhost:3000/reset_database'});
    });

    it('add poll including answers', function() {
		cy.request({
            method: 'post',
            url: 'http://localhost:3000/api/polls',
            body: {"userId" : 1, "question" : 'favorite color'},
        }).then((response) => {
            expect(response.status).to.eq(201);
            cy.wrap(response.body.id).as('pollId');
        });     
        
        cy.get('@pollId').then((pollId) => {
            cy.request({
                method: 'POST',
                url: `http://localhost:3000/api/polls/${pollId}/answers`,
                body: { "pollId": pollId, "answer": 'red' },
            }).then((response) => {
                expect(response.status).to.eq(201);
            });
        });
        cy.get('@pollId').then((pollId) => {
            cy.request({
                method: 'POST',
                url: `http://localhost:3000/api/polls/${pollId}/answers`,
                body: { "pollId": pollId, "answer": 'blue' },
            }).then((response) => {
                expect(response.status).to.eq(201);
            });
        });

	});

    it('delete poll', function() {
		cy.request({
            method: 'delete',
            url: 'http://localhost:3000/api/polls/1'
        }).then((response) => {
            expect(response.status).to.eq(200);
          });           
	});


});
