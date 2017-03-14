import { UserAuthWrapper } from 'redux-auth-wrapper'

import * as PERMISSIONS from '../constants/permissions'
import { MEDIA_DELIVERY_SECURITY } from '../constants/service-permissions'
import checkPermissions from './permissions'

const authSelector = state => state.user.get('currentUser')
const permissionChecker = (permission, store) => user => {
  if(!permission) {
    return true
  }
  return checkPermissions(
    store.getState().roles.get('roles'),
    user,
    permission
  )
}

const servicePermissionChecker = (permission) => permissions => {
  if(!permission || !permissions || !permissions.size) {
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
      const currentUser = state.user.get('currentUser')
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
      const currentUser = state.user.get('currentUser')
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
      const currentUser = state.user.get('currentUser')
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
        return checkPermissions(
          store.getState().roles.get('roles'),
          state.user.get('currentUser'),
          perm
        )
      })
      if(fallback) {
        let path = ownProps.location.pathname.replace(/\/$/, '')
        path = path.substr(0, path.lastIndexOf('/'))
        return `${path}/${fallback[1]}`
      }
      else {
        // TODO: Where should we send them? Wrap these checks to 404 on error?
        throw("User doesn't have permission to see any analytics tabs.")
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
      let path = ownProps.location.pathname.replace(/\/$/, '')
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
    authSelector: state => state.group.get('servicePermissions'),
    failureRedirectPath: (state, ownProps) => {
      const path = ownProps.location.pathname.replace(/\/security/, '')

      return `${path}`
    },
    wrapperDisplayName: 'CanViewConfigurationSecurity',
    predicate: servicePermissionChecker(MEDIA_DELIVERY_SECURITY, store),
    allowRedirectBack: false
  })
}

export const canViewStorageSummary = (store) => {
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
