describe("users", function() {
    beforeEach(function () {
        cy.request({method: 'PUT', url: 'http://localhost:3000/reset_database'});
    });

    it('add user', function() {
		cy.request({
            method: 'post',
            url: 'http://localhost:3000/api/users',
            body: {"name" : "qwerty", "password" : '1234'},
        }).then((response) => {
            expect(response.status).to.eq(201);
          });           
	});

    it('get user', function() {
		cy.request({
            method: 'get',
            url: 'http://localhost:3000/api/users/rub',
        }).then((response) => {
            expect(response.status).to.eq(200);
          });           
	});

    // it('get user that doesnt exist', function() {
	// 	cy.request({
    //         method: 'get',
    //         url: 'http://localhost:3000/api/users/dwkdfnwkednw',
    //         failOnStatusCode: false
    //     }).then((response) => {
    //         expect(response.status).to.eq(404);
    //       });           
	// });
});
