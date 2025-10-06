describe("votes", function() {
    beforeEach(function () {
        cy.request({method: 'PUT', url: 'http://localhost:3000/reset_database'});
    });

    it('remove vote', function() {
		cy.request({
            method: 'delete',
            url: 'http://localhost:3000/api/answer/1/votes/1'
        }).then((response) => {
            expect(response.status).to.eq(200);
          });           
	});


    it('add vote', function() {
		cy.request({
            method: 'post',
            url: 'http://localhost:3000/api/answer/2/votes',
            body: {"userId" : 1}
        }).then((response) => {
            expect(response.status).to.eq(201);
          });           
	});
});
