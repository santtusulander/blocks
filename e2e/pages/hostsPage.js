module.exports = {
  url: 'http://localhost:3000/content/hosts/udn/2/5',
  elements: {
    pageHeader: {
      selector: '.page-header-layout p'
    },
    pageTitle: {
      selector: '.page-header-layout h1'
    },
    analyticsIcon: {
      selector: '.btn-toolbar > a:first-of-type'
    },
    amoebaAnalyticsIcon: {
      selector: 'div[id*="renandstimpy"] .content-item-toolbar .btn-toolbar a:first-of-type'
    },
    addPropertyIcon: {
      selector: '.btn-toolbar > button.btn-add-new'
    },
    amoebaConfigurationsIcon: {
      selector: 'div[id*="renandstimpy"] .content-item-toolbar .btn-toolbar a:last-of-type'
    },
    sortDropdown: {
      selector: '.btn-toolbar > div.dropdown > .dropdown-toggle'
    },
    firstBreadcrumbItem: {
      selector: '.breadcrumb li:first-of-type'
    },
    firstAmoebaTitle: {
      selector: '.content-item-grid .grid-item:first-of-type .content-item-chart-name'
    },
    lastAmoebaTitle: {
      selector: '.content-item-grid .grid-item:last-of-type .content-item-chart-name'
    },
    stimpyAmoeba: {
      selector: 'div[id*="renandstimpy"]'
    }
  }
};
