import { getRoute } from '../routes.jsx'
import analyticsTabConfig from '../constants/analytics-tab-config.js'
import checkPermissions from './permissions'
import VIEW_CONTENT_PROPERTIES from '../constants/permissions'

export function getUrl(baseUrl, linkType, val, params) {
  const { brand, account, group } = params;

  let url
  switch(linkType) {
    case 'brand':
      url = `${baseUrl}/${val}`
      break;
    case 'account':
      url = `${baseUrl}/${brand}/${val}`
      break;
    case 'group':
      url = `${baseUrl}/${brand}/${account}/${val}`
      break;
    case 'property':
      url = `${baseUrl}/${brand}/${account}/${group}/${val}`
      break;
  }

  return url
}

export function getAnalyticsUrl(linkType, val, params) {
  const { brand, account, group } = params,
    baseUrl = getRoute('analytics')

  let url
  switch(linkType) {
    case 'brand':
      url = `${baseUrl}/${val}`
      break;
    case 'account':
      url = `${baseUrl}/${brand}/${val}`
      break;
    case 'group':
      url = `${baseUrl}/${brand}/${account}/${val}`
      break;
    case 'property':
      url = `${baseUrl}/${brand}/${account}/${group}/${val}`
      break;
  }

  return url
}

export function getContentUrl(linkType, val, params) {
  const { brand, account, group } = params,
    baseUrl = getRoute('content')

  let url
  switch(linkType) {
    case 'brand':
      url = `${baseUrl}/${val}`
      break;
    case 'account':
      url = `${baseUrl}/${brand}/${val}`
      break;
    case 'groups':
      url = `${baseUrl}/${brand}/${val}/groups`
      break;
    case 'group':
      url = `${baseUrl}/${brand}/${account}/groups/${val}`
      break;
    case 'property':
      url = `${baseUrl}/${brand}/${account}/groups/${group}/${val}`
      break;
    case 'propertyAnalytics':
      url = `${baseUrl}/${brand}/${account}/groups/${group}/${val}/analytics`
      break;
    case 'propertyConfiguration':
      url = `${baseUrl}/${brand}/${account}/groups/${group}/${val}/configuration`
      break;
  }

  return url
}

export function getNetworkUrl(linkType, val, params) {
  const { brand, account } = params,
    baseUrl = getRoute('network')

  let url
  switch(linkType) {
    case 'brand':
      url = `${baseUrl}/${val}`
      break;
    case 'account':
      url = `${baseUrl}/${brand}/${val}`
      break;
    case 'group':
      url = `${baseUrl}/${brand}/${account}/${val}`
      break;
  }

  return url
}

export function getAnalyticsUrlFromParams(params, currentUser, roles) {
  const allowedTab = analyticsTabConfig.find(tab =>  checkPermissions(
    roles, currentUser, tab.get('permission')
  ))
  const landingTab = allowedTab ? allowedTab.get('key') : ''
  const { brand, account, group, property } = params,
    baseUrl = getRoute('analytics')


  if (property) {
    return `${baseUrl}/${brand}/${account}/${group}/${property}/${landingTab}`
  } else if (group) {
    return `${baseUrl}/${brand}/${account}/${group}/${landingTab}`
  } else if (account) {
    return `${baseUrl}/${brand}/${account}/${landingTab}`
  } else if (brand) {
    return `${baseUrl}/${brand}`
  } else {
    return `${baseUrl}/udn`
  }
}

export function getContentUrlFromParams(params, currentUser, roles) {
  const { brand, account, group, property } = params,
    baseUrl = getRoute('content'),
    canListProperties = checkPermissions(roles, currentUser, VIEW_CONTENT_PROPERTIES)

  if (property) {
    return `${baseUrl}/${brand}/${account}/${group}/${property}`
  } else if (group && canListProperties) {
    return `${baseUrl}/${brand}/${account}/${group}`
  } else if (account) {
    return `${baseUrl}/${brand}/${account}`
  } else if (brand) {
    return `${baseUrl}/${brand}`
  } else {
    return `${baseUrl}/udn`
  }
}

export function getAccountManagementUrlFromParams(params) {
  const { brand, account, group, property } = params

  if (property) {
    return getRoute('accountManagementProperty', params)
  } else if (group) {
    return getRoute('accountManagementGroup', params)
  } else if (account) {
    return getRoute('accountManagementAccount', params)
  } else if (brand) {
    return getRoute('accountManagementBrand', params)
  } else {
    return getRoute('accountManagementBrand', { brand: 'udn' })
  }
}

export function getServicesUrlFromParams(params) {
  const { brand, account, group, property } = params

  if (property) {
    return getRoute('servicesProperty', params)
  } else if (group) {
    return getRoute('servicesGroup', params)
  } else if (account) {
    return getRoute('servicesAccount', params)
  } else if (brand) {
    return getRoute('servicesBrand', params)
  } else {
    return getRoute('servicesBrand', { brand: 'udn' })
  }
}

export function getSupportUrlFromParams(params) {
  const { brand, account, group, property } = params

  if (property) {
    return getRoute('supportProperty', params)
  } else if (group) {
    return getRoute('supportGroup', params)
  } else if (account) {
    return getRoute('supportAccount', params)
  } else if (brand) {
    return getRoute('supportBrand', params)
  } else {
    return getRoute('supportBrand', { brand: 'udn' })
  }
}

export function getSecurityUrlFromParams(params) {
  const { brand, account, group, property } = params

  if (property) {
    return getRoute('securityProperty', params)
  } else if (group) {
    return getRoute('securityGroup', params)
  } else if (account) {
    return getRoute('securityAccount', params)
  } else if (brand) {
    return getRoute('securityBrand', params)
  } else {
    return getRoute('securityBrand', { brand: 'udn' })
  }
}

export function getDashboardUrlFromParams(params) {
  const { brand, account } = params

  if (account) {
    return getRoute('dashboardAccount', params)
  } else if (brand) {
    return getRoute('dashboardBrand', params)
  } else {
    return getRoute('dashboardBrand', { brand: 'udn' })
  }
}

export function getNetworkUrlFromParams(params) {
  const { brand, account } = params

  if (account) {
    return getRoute('networkAccount', params)
  } else if (brand) {
    return getRoute('networkBrand', params)
  } else {
    return getRoute('networkBrand', { brand: 'udn' })
  }
}

export function getUserUrlFromParams(params) {
  const { brand, account } = params

  if (account) {
    return getRoute('userAccount', params)
  } else if (brand) {
    return getRoute('userBrand', params)
  } else {
    return getRoute('userBrand', { brand: 'udn' })
  }
}
