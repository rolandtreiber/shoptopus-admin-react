describe('auth tests', () => {
  Cypress.config('defaultCommandTimeout', 100000);
  
  before(() => {
    cy.fixture('env').then((data) => {
      globalThis = data
    })
  })
  
  it('can login', () => {
    cy.visit(globalThis.baseUrl+"/login")
    cy.get(':nth-child(1) > .MuiFormControl-root > .MuiFilledInput-root > .MuiFilledInput-input')
      .clear()
      .type('superadmin@m.com')
    cy.get(':nth-child(2) > .MuiFormControl-root > .MuiFilledInput-root > .MuiFilledInput-input')
      .clear()
      .type('shop')
    cy.get(':nth-child(3) > .MuiButton-root').click().wait(200)
    cy.get('.css-1mk9mw3-MuiList-root > :nth-child(1) > .MuiButton-root').should('have.text', "Dashboard")
  })
});