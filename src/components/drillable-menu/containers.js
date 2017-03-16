import { connect } from 'react-redux'

import propertyActions from '../../redux/modules/entities/properties/actions'
import groupActions from '../../redux/modules/entities/groups/actions'
import accountActions from '../../redux/modules/entities/accounts/actions'
import storageActions from '../../redux/modules/entities/CIS-ingest-points/actions'

import { getGroups, getBrands, getAccounts } from './menu-selectors'

import {
  VIEW_CONTENT_ACCOUNTS,
  VIEW_CONTENT_GROUPS,
  VIEW_CONTENT_PROPERTIES,
  LIST_STORAGE } from '../../constants/permissions'

import checkPermissions from '../../util/permissions'

import Selector from './'

/**
 * Runs check for a permission to determine whether the entity tree
 * passed to the menu component contains entities for a level corresponding that permission.
 * @param  {[Array]} levels      desired levels for the account selector
 * @param  {[Map]}   user        current active user
 * @param  {[List]}  roles       all roles
 * @param  {[type]}  permission  permission to check against
 * @return Boolean
 */
const permissionCheck = (levels, user, roles) => permission => {
  let hasLevel = false

  switch(permission) {

    case VIEW_CONTENT_ACCOUNTS:
      hasLevel = levels.includes('brand')
      break

    case VIEW_CONTENT_GROUPS:
      hasLevel = levels.includes('account')
      break

    case LIST_STORAGE:
    case VIEW_CONTENT_PROPERTIES:
      hasLevel = levels.includes('group')
      break
  }

  return hasLevel && checkPermissions(roles, user, permission)
}

/**
 * dispatch to props for account selectors
 * @param  {[type]} dispatch [description]
 * @param  {[type]} params   [description]
 * @param  {[type]} levels   [description]
 * @return {[type]}          [description]
 */
const accountSelectorDispatchToProps = (dispatch, { params: { brand, account, group, property, storage }, levels = ['brand', 'account', 'group'] }) => {

  return {
    dispatch,
    fetchData: (user, roles) => {

      const shouldFetch = permissionCheck(levels, user, roles)

      return Promise.all([

        shouldFetch(VIEW_CONTENT_ACCOUNTS) && dispatch(accountActions.fetchAll({ brand })),

        !shouldFetch(VIEW_CONTENT_ACCOUNTS) && dispatch(accountActions.fetchOne({ brand, id: account })),

        shouldFetch(VIEW_CONTENT_GROUPS) && account && dispatch(groupActions.fetchAll({ brand, account })),

        shouldFetch(VIEW_CONTENT_PROPERTIES) && (property || storage) && dispatch(propertyActions.fetchAll({ brand, account, group })),

        shouldFetch(LIST_STORAGE) && (property || storage) && dispatch(storageActions.fetchAll({ brand, account, group }))

      ])
    }
  }
}

 /**
  * state to props for the account selector
  * @param  {[type]} state             [description]
  * @param  {[type]} params            [description]
  * @param  {[type]} levels            which levels are set for an instance of the GAS
  * @return {[type]}                   [description]
  */
const accountSelectorStateToProps = (state, { params: { property, group, account, brand }, levels = ['brand', 'account', 'group'] }) => {

  const canView = permissionCheck(levels, state.user.get('currentUser'), state.roles.get('roles'))

  const brandIsTopLevel = canView(VIEW_CONTENT_ACCOUNTS)
  const accountIsTopLevel = canView(VIEW_CONTENT_GROUPS)
  const groupIsTopLevel = canView(VIEW_CONTENT_PROPERTIES) || canView(LIST_STORAGE)

  let activeNode = brand
  let tree = []

  if (brandIsTopLevel) {

    tree = getBrands(state, brand, canView)

  } else if (accountIsTopLevel) {

    tree = getAccounts(state, { brand }, canView)

  } else if (groupIsTopLevel) {

    tree = getGroups(state, { brand, account }, canView)
  }

  if (brandIsTopLevel && brand) {
    activeNode = brand
  }
  if (accountIsTopLevel && account) {
    activeNode = account
  }
  if (groupIsTopLevel && property) {
    activeNode = group
  }


  return {
    activeNode,
    tree
  }
}

export const AccountSelector = connect(accountSelectorStateToProps, accountSelectorDispatchToProps)(Selector)
