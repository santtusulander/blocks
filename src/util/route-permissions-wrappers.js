import { UserAuthWrapper } from 'redux-auth-wrapper'

import * as PERMISSIONS from '../constants/permissions'
import checkPermissions from './permissions'

const authSelector = state => state.user.get('currentUser')
const permissionChecker = (permission, store) => user => checkPermissions(
    store.getState().roles.get('roles'),
    user,
    permission
  )

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
