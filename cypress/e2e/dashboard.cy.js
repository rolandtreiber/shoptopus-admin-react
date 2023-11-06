Cypress.Commands.add('login', (username, password) => {
  cy.visit(globalThis.baseUrl + "/login")
  cy.get(':nth-child(1) > .MuiFormControl-root > .MuiFilledInput-root > .MuiFilledInput-input')
    .clear()
    .type(username)
  cy.get(':nth-child(2) > .MuiFormControl-root > .MuiFilledInput-root > .MuiFilledInput-input')
    .clear()
    .type(password)
  cy.get(':nth-child(3) > .MuiButton-root').click().wait(200)
  cy.get('.css-1mk9mw3-MuiList-root > :nth-child(1) > .MuiButton-root').should('have.text', "Dashboard")
})

describe('auth tests', () => {
  Cypress.config('defaultCommandTimeout', 100000);
  
  before(() => {
    cy.fixture('env').then((data) => {
      globalThis = data
    })
  })
  
  beforeEach(() => {
    cy.login('superadmin@m.com', 'shop')
  })
  
  it('can visit dashboard', () => {
    cy.visit(globalThis.baseUrl + "/dashboard").wait(5000)
    cy.get('.MuiBox-root > .MuiTypography-root').should('have.text', "Welcome")
    cy.get(':nth-child(1) > .MuiPaper-root > .css-ox0m8v > :nth-child(2) > .MuiTypography-overline').should("have.text", "Orders")
    cy.get(':nth-child(1) > .MuiPaper-root > .css-ox0m8v > :nth-child(2) > .MuiTypography-h6').should("have.text", "15")
    cy.get('.MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-action > .MuiButton-root').first().click()
    cy.get('.MuiMenu-root > .MuiPaper-root > .MuiList-root > :nth-child(2)').should("exist").should("have.text", "Last Month")
    cy.get('.MuiMenu-root > .MuiPaper-root > .MuiList-root > :nth-child(3)').should("exist").should("have.text", "Last Year")
    cy.get('.MuiMenu-root > .MuiPaper-root > .MuiList-root > :nth-child(2)').should("exist").click().wait(200)
  })
  
  it('can change language', () => {
    cy.visit(globalThis.baseUrl + "/dashboard").wait(5000)
    cy.get('#selected-language-button-desktop').click()
    cy.get('#language-selector-popover-desktop :nth-child(2) > .MuiListItemText-root > .MuiTypography-root').click()
    cy.get('.MuiBox-root > .MuiTypography-root').should('have.text', "Willkommen")
    cy.get('.Mui-selected').should('have.text', "Überblick")
  })

});