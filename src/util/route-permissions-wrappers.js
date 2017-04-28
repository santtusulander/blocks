import { UserAuthWrapper } from 'redux-auth-wrapper'

import * as PERMISSIONS from '../constants/permissions'
import { MEDIA_DELIVERY_SECURITY, GTM_SERVICE_ID } from '../constants/service-permissions'
import { checkUserPermissions } from './permissions'
import { getById as getAccountById } from '../redux/modules/entities/accounts/selectors'

import { getById as getGroupById } from '../redux/modules/entities/groups/selectors'
import { getFetchingByTag } from '../redux/modules/fetching/selectors'
import { getCurrentUser } from '../redux/modules/user'

import { getServicePermissions } from '../util/services-helpers'

import {
  hasService
} from '../util/helpers'

import {
  accountIsContentProviderType,
  accountIsCloudProviderType
 } from '../util/helpers'

const authSelector = state => getCurrentUser(state)
const permissionChecker = (permission /*, store*/) => user => {
  if (!permission) {
    return true
  }
  return checkUserPermissions(
    user,
    permission
  )
}

const servicePermissionChecker = (permission) => permissions => {
  if (!permission || !permissions || !permissions.size) {
    return true
  }

  return permissions.contains(permission)
}

export const UserHasPermission = (permission, store) => UserAuthWrapper({
  authSelector: authSelector,
  failureRedirectPath: '/',
  wrapperDisplayName: 'UserHasPermission',
  predicate: permissionChecker(permission, store),
  allowRedirectBack: false
})(props => props.children)

export const UserCanListAccounts = store => {
  return UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const currentUser = getCurrentUser(state)
      const path = ownProps.location.pathname.replace(/\/$/, '')
      return `${path}/${currentUser.get('account_id')}`
    },
    wrapperDisplayName: 'UserCanListAccounts',
    predicate: permissionChecker(PERMISSIONS.VIEW_CONTENT_ACCOUNTS, store),
    allowRedirectBack: false
  })
}

export const UserCanManageAccounts = store => {
  return UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const currentUser = getCurrentUser(state)
      const path = ownProps.location.pathname.replace(/\/accounts$/, '')
        .replace(/\/$/, '')
      return `${path}/${currentUser.get('account_id')}`
    },
    wrapperDisplayName: 'UserCanManageAccounts',
    predicate: permissionChecker(PERMISSIONS.VIEW_CONTENT_ACCOUNTS, store),
    allowRedirectBack: false
  })
}

export const UserCanTicketAccounts = store => {
  return UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const currentUser = getCurrentUser(state)
      const path = ownProps.location.pathname.replace(/\/tickets$/, '')
        .replace(/\/$/, '')
      return `${path}/${currentUser.get('account_id')}`
    },
    wrapperDisplayName: 'UserCanTicketAccounts',
    predicate: permissionChecker(PERMISSIONS.VIEW_CONTENT_ACCOUNTS, store),
    allowRedirectBack: false
  })
}

export const UserCanViewAnalyticsTab = (permission, store, allTabs) => {
  return UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const fallback = allTabs.find(([perm]) => {
        return checkUserPermissions(
          getCurrentUser(state),
          perm
        )
      })
      if (fallback) {
        let path = ownProps.location.pathname.replace(/\/$/, '')
        path = path.substr(0, path.lastIndexOf('/'))
        return `${path}/${fallback[1]}`
      } else {
        // TODO: Where should we send them? Wrap these checks to 404 on error?
        throw ("User doesn't have permission to see any analytics tabs.")
      }
    },
    wrapperDisplayName: 'UserCanViewAnalyticsTab',
    predicate: permissionChecker(permission, store),
    allowRedirectBack: false
  })
}

export const UserCanViewDns = (store) => {
  return UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/dns/, 'accounts')

      return `${path}`
    },
    wrapperDisplayName: 'UserCanViewDns',
    predicate: permissionChecker(PERMISSIONS.VIEW_DNS, store),
    allowRedirectBack: false
  })
}

export const UserCanViewHosts = (store) => {
  return UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/$/, '')
      return path.substr(0, path.lastIndexOf('/'))
    },
    wrapperDisplayName: 'UserCanViewHosts',
    predicate: permissionChecker(PERMISSIONS.VIEW_CONTENT_PROPERTIES, store),
    allowRedirectBack: false
  })
}

export const UserCanViewAccountDetail = (store) => {
  return UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const pathname = ownProps.location.pathname
      return `${pathname}/groups`
    },
    wrapperDisplayName: 'UserCanViewAccountDetail',
    predicate: permissionChecker(PERMISSIONS.VIEW_ACCOUNT_DETAIL, store),
    allowRedirectBack: false
  })
}

export const CanViewConfigurationSecurity = (store) => {
  return UserAuthWrapper({
    authSelector: (state, ownProps) => {
      const activeGroup = getGroupById(state, ownProps.params.group)

      return getServicePermissions(activeGroup)
    },
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/security/, '')

      return `${path}`
    },
    wrapperDisplayName: 'CanViewConfigurationSecurity',
    predicate: servicePermissionChecker(MEDIA_DELIVERY_SECURITY, store),
    allowRedirectBack: false
  })
}

export const CanViewStorageSummary = (store) => {
  return UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/storage\/\w+/, '')

      return `${path}`
    },
    wrapperDisplayName: 'CanViewStorageSummary',
    predicate: permissionChecker(PERMISSIONS.VIEW_STORAGE, store),
    allowRedirectBack: false
  })
}

export const CanViewStorageTab = (store) => {
  return UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/storage$/, '')

      return `${path}`
    },
    wrapperDisplayName: 'CanViewStorageTab',
    predicate: permissionChecker(PERMISSIONS.LIST_STORAGE, store),
    allowRedirectBack: false
  })
}

export const UserCanViewGTM = UserAuthWrapper({
  authSelector: (state, ownProps) => {
    const activeGroup =
      getGroupById(state, ownProps.params.group)
    return activeGroup
  },
  authenticatingSelector: (state) => getFetchingByTag(state, 'group'),
  wrapperDisplayName: 'GroupHasGTMService',
  predicate: (group) => {
    if (!group) {
      return true
    } else {
      return hasService(group, GTM_SERVICE_ID)
    }
  },
  failureRedirectPath: (state, ownProps) => {
    const redirectPath = ownProps.location.pathname.replace(new RegExp(/\/gtm\/?$/, 'i'), '')
    return redirectPath
  },
  allowRedirectBack: false
})

export const UserCanViewAdvancedTab = (store) => {
  return UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/advanced$/, '')

      return `${path}`
    },
    wrapperDisplayName: 'CanViewAdvancedTab',
    predicate: permissionChecker(PERMISSIONS.VIEW_ADVANCED, store),
    allowRedirectBack: false
  })
}

export const AccountCanViewProperties = UserAuthWrapper({
  authSelector: (state, ownProps) => {
    const account =
      getAccountById(state, ownProps.params.account)
    return {
      account,
      accountId: ownProps.params.account
    }

  },
  authenticatingSelector: (state) => getFetchingByTag(state, 'accounts'),
  wrapperDisplayName: 'AccountCanViewProperties',
  predicate: ({account}) => {
    if (!account) {
      return true
    } else {
      return accountIsContentProviderType(account) || accountIsCloudProviderType(account)
    }
  },
  failureRedirectPath: (state, ownProps) => {
    const redirectPath = ownProps.location.pathname.replace(new RegExp(/\/properties/, 'i'), '')
    return redirectPath
  },
  allowRedirectBack: false
})
