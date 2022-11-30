describe('Testing Leaflet control layers', () => {
  const controlSelector = '.leaflet-control-layers';
  const controlExpandedSelector = `.leaflet-control-layers-expanded`;
  const overlayersTitleSelector = '.title-layer';
  // Go to home page
  before(() => {
    cy.geonatureLogout();
    cy.geonatureLogin();
    cy.visit('/#/');
  });
  it('should display "overlayers button controler"', async () => {
    cy.get(controlSelector).should('be.visible');
    cy.get(controlSelector).trigger('mouseover');
    cy.get(controlExpandedSelector).should('be.visible');
  });
  it('should control "overlayers content"', async () => {
    cy.get(overlayersTitleSelector).should('have.length', 1);
    cy.get(overlayersTitleSelector).first().should('contains.text', 'Znieff de Bretagne');
  });
});
