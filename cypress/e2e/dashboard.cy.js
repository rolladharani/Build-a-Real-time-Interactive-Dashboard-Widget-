describe("Real-Time Dashboard", () => {

  beforeEach(() => {
    cy.visit("http://localhost:3000")
  })

  it("loads dashboard UI", () => {
    cy.contains("Real-Time Dashboard").should("be.visible")
  })

  it("shows live events list", () => {
    cy.contains("Live Events").should("be.visible")
  })

  it("filters by type", () => {

  cy.get('select[aria-label="Filter events by type"]').select("log")

  // wait for websocket events to appear
  cy.wait(2000)

  cy.get("li").should("have.length.at.least", 1)

})

  it("filters by severity", () => {
    cy.get('select[aria-label="Filter events by severity"]').select("high")

    cy.get("li").each(($el) => {
      cy.wrap($el).should("contain", "high")
    })
  })

  it("toggles sort order", () => {
    cy.contains("Sort").click()
    cy.contains("Sort").click()
  })

})