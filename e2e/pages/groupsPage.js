module.exports = {
  url: 'http://localhost:3000/content/groups/udn/2',
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
      selector: '#content-item-chart-5 .content-item-toolbar .btn-toolbar a'
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
    nickelodeonAmoeba: {
      selector: '#content-item-chart-5'
    }
  }
};
