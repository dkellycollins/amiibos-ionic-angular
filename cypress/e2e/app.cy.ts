describe('Amiibos App', () => {
  it('should load the app', () => {
    cy.visit('/');
    cy.contains('Amiibos');
  });
});
