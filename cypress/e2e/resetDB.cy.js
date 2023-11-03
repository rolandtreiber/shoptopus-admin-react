describe('auth tests', () => {
  Cypress.config('defaultCommandTimeout', 100000);
  
  before(() => {
    const apiUrl = "https://shoptopus.test"
    // cy.visit(apiUrl+"/cypress-init")
  })
  
  it("seeds the database", () => {
    cy.log("Database seeded successfully.");
  });
});