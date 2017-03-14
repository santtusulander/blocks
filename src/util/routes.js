import analyticsTabConfig from '../constants/analytics-tab-config.js'
import checkPermissions from './permissions'
import routes from '../constants/routes'
import {
  VIEW_CONTENT_PROPERTIES,
  VIEW_ACCOUNT_DETAIL
} from '../constants/permissions'

/**
 *
 * @param {string} name
 * @param {Object} params
 * @returns {string}
 */
export function getRoute(name, params) {
  if (!routes[name]) {
    throw new Error('Unknown route "%s"', name)
  }

  let route = routes[name]

  if (params) {
    Object.keys(params).forEach(key => {
      route = route.replace(`:${key}`, params[key])
    })
  }

  return route
}

export function getUrl(baseUrl, linkType, val, params) {
  // eslint-disable-next-line no-console
  console.warn('Avoid using getUrl as it is very brittle: build links using the getRoute method instead.')

  const { brand, account, group } = params;

  let url = baseUrl

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
  switch(linkType) {
    case 'brand':
      return getRoute('analyticsBrand', { brand: val })
    case 'account':
      return getRoute('analyticsAccount', { ...params, account: val })
    case 'group':
      return getRoute('analyticsGroup', { ...params, group: val })
    case 'property':
      return getRoute('analyticsProperty', { ...params, property: val })
    case 'storage':
      return getRoute('analyticsStorage', { ...params, storage: val })
  }
}

export function getDashboardUrl(linkType, val, params) {
  switch(linkType) {
    case 'brand':
      return getRoute('dashboardBrand', { brand: val })
    case 'account':
      return getRoute('dashboardAccount', { ...params, account: val })
  }
}

export function getContentUrl(linkType, val, params) {
  switch(linkType) {
    case 'brand':
      return getRoute('contentBrand', { brand: val })
    case 'account':
      return getRoute('contentAccount', { ...params, account: val })
    case 'groups':
      return getRoute('contentGroups', { ...params, account: val })
    case 'group':
      return getRoute('contentGroup', { ...params, group: val })
    case 'property':
      return getRoute('contentProperty', { ...params, property: val })
    case 'propertyConfiguration':
      return getRoute('contentPropertyConfiguration', { ...params, property: val })
    case 'storage':
      return getRoute('contentStorage', { ...params, storage: val })
  }
}

export function getNetworkUrl(linkType, val, params) {
  switch(linkType) {
    case 'brand':
      return getRoute('networkBrand', { brand: val })
    case 'account':
      return getRoute('networkAccount', { ...params, account: val })
    case 'groups':
      return getRoute('networkGroups', { ...params, account: val ? val : params.account })
    case 'group':
      return getRoute('networkGroup', { ...params, group: val })
    case 'network':
      return getRoute('networkNetwork', { ...params, network: val })
    case 'pop':
      return getRoute('networkPop', { ...params, pop: val })
    case 'pod':
      return getRoute('networkPod', { ...params, pod: val })
  }
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
    canListProperties = checkPermissions(roles, currentUser, VIEW_CONTENT_PROPERTIES),
    canViewAccountDetail = checkPermissions(roles, currentUser, VIEW_ACCOUNT_DETAIL)

  if (property) {
    return getRoute('contentProperty', params)
  } else if (group && canListProperties) {
    return getRoute('contentGroup', params)
  } else if (account) {
    if (canViewAccountDetail) {
      return getRoute('contentAccount', params)
    } else {
      return getRoute('contentGroups', params)
    }
  } else if (brand) {
    return getRoute('contentBrand', params)
  } else {
    return getRoute('contentBrand', { brand: 'udn' })
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
  const { brand, account, group, property } = params

  if (property) {
    return getRoute('dashboardProperty', params)
  } else if (group) {
    return getRoute('dashboardGroup', params)
  } else if (account) {
    return getRoute('dashboardAccount', params)
  } else if (brand) {
    return getRoute('dashboardBrand', params)
  } else {
    return getRoute('dashboardBrand', { brand: 'udn' })
  }
}

export function getNetworkUrlFromParams(params, currentUser, roles) {
  const { brand, account, group } = params,
    canViewAccountDetail = checkPermissions(roles, currentUser, VIEW_ACCOUNT_DETAIL)

  if (account) {
    if (group) {
      return getRoute('networkGroup', params)
    } else if (canViewAccountDetail) {
      return getRoute('networkAccount', params)
    } else {
      return getRoute('networkGroups', params)
    }
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
