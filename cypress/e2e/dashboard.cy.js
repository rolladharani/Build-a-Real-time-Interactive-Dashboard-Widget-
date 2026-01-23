describe("Real-Time Dashboard E2E", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("shows dashboard title", () => {
    cy.contains("Real-Time Dashboard").should("be.visible");
  });

  it("shows total events counter", () => {
    cy.contains("Total Events").should("be.visible");
  });

  it("shows live events list", () => {
    cy.contains("Live Events").should("be.visible");
  });

  it("filters by type", () => {
    cy.get('select[aria-label="Filter events by type"]').select("log");
  });

  it("filters by severity", () => {
    cy.get('select[aria-label="Filter events by severity"]').select("high");
  });
});
