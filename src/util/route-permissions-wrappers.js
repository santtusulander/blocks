import { UserAuthWrapper } from 'redux-auth-wrapper'

import * as PERMISSIONS from '../constants/permissions'
import { MEDIA_DELIVERY_SECURITY, GTM_SERVICE_ID } from '../constants/service-permissions'
import { checkUserPermissions } from './permissions'
import { getById as getAccountById } from '../redux/modules/entities/accounts/selectors'

import { getById as getGroupById } from '../redux/modules/entities/groups/selectors'
import { getFetchingByTag } from '../redux/modules/fetching/selectors'
import { getCurrentUser } from '../redux/modules/user'

import { getServicePermissions } from '../util/services-helpers'
import { getRoute } from '../util/routes'
import {
  hasService
} from '../util/helpers'

import {
  accountIsContentProviderType,
  accountIsCloudProviderType
 } from '../util/helpers'

const authSelector = state => getCurrentUser(state)
const permissionChecker = (permission) => user => {
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

export const UserHasPermission = (permission) => UserAuthWrapper({
  authSelector: authSelector,
  failureRedirectPath: '/',
  wrapperDisplayName: 'UserHasPermission',
  predicate: permissionChecker(permission),
  allowRedirectBack: false
})(props => props.children)

export const UserCanListAccounts = (failureRoute) =>
  UserAuthWrapper({
    authSelector: (state, { params }) => ({ user: getCurrentUser(state), params }),
    failureRedirectPath: (state, ownProps) => {

      return getRoute(failureRoute, { ...ownProps.params, account: getCurrentUser(state).get('account_id') })

    },
    wrapperDisplayName: 'UserCanListAccounts',
    predicate: ({ user, params }) => {

      const userHasAccount = String(user.get('account_id')) === params.account

      return user.size <= 1 || checkUserPermissions(user, PERMISSIONS.VIEW_CONTENT_ACCOUNTS) || userHasAccount
    },
    allowRedirectBack: false
  })

export const UserCanViewAnalyticsTab = (permission, allTabs) => {
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
    predicate: permissionChecker(permission),
    allowRedirectBack: false
  })
}

export const UserCanViewDns =
  UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/dns/, 'accounts')

      return `${path}`
    },
    wrapperDisplayName: 'UserCanViewDns',
    predicate: permissionChecker(PERMISSIONS.VIEW_DNS),
    allowRedirectBack: false
  })

export const UserCanViewHosts =
  UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/$/, '')
      return path.substr(0, path.lastIndexOf('/'))
    },
    wrapperDisplayName: 'UserCanViewHosts',
    predicate: permissionChecker(PERMISSIONS.VIEW_CONTENT_PROPERTIES),
    allowRedirectBack: false
  })


export const UserCanViewAccountDetail =
  UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const pathname = ownProps.location.pathname
      return `${pathname}/groups`
    },
    wrapperDisplayName: 'UserCanViewAccountDetail',
    predicate: permissionChecker(PERMISSIONS.VIEW_ACCOUNT_DETAIL),
    allowRedirectBack: false
  })

export const CanViewConfigurationSecurity =
  UserAuthWrapper({
    authSelector: (state, ownProps) => {
      const activeGroup = getGroupById(state, ownProps.params.group)

      return getServicePermissions(activeGroup)
    },
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/security/, '')

      return `${path}`
    },
    wrapperDisplayName: 'CanViewConfigurationSecurity',
    predicate: servicePermissionChecker(MEDIA_DELIVERY_SECURITY),
    allowRedirectBack: false
  })

export const CanViewStorageSummary =
  UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/storage\/\w+/, '')

      return `${path}`
    },
    wrapperDisplayName: 'CanViewStorageSummary',
    predicate: permissionChecker(PERMISSIONS.VIEW_STORAGE),
    allowRedirectBack: false
  })

export const CanViewStorageTab =
  UserAuthWrapper({
    authSelector: (state, ownProps) => {
      return {
        currentUser: authSelector(state),
        account: getAccountById(state, ownProps.params.account)
      }
    },
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/storage$/, '')

      return `${path}`
    },
    wrapperDisplayName: 'CanViewStorageTab',
    predicate: ({ currentUser, account }) => {
      return accountIsContentProviderType(account) && permissionChecker(PERMISSIONS.LIST_STORAGE)(currentUser)
    },
    allowRedirectBack: false
  })

export const CanViewBrandDashboard = (store) => {
  return UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const currentUser = state.user.get('currentUser')
      const path = `${ownProps.location.pathname}/${currentUser.get('account_id')}`
      const backupPath = ownProps.location.pathname.replace(/\/dashboard\/\w+/, 'content')

      return currentUser ? path : backupPath
    },
    wrapperDisplayName: 'CanViewBrandDashboard',
    predicate: permissionChecker(PERMISSIONS.VIEW_BRAND_DASHBOARD_SECTION, store),
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

export const UserCanViewAdvancedTab =
  UserAuthWrapper({
    authSelector: authSelector,
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/advanced$/, '')

      return `${path}`
    },
    wrapperDisplayName: 'CanViewAdvancedTab',
    predicate: permissionChecker(PERMISSIONS.VIEW_ADVANCED),
    allowRedirectBack: false
  })

export const AccountCanViewProperties =
  UserAuthWrapper({
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
