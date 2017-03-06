import { connect } from 'react-redux'

import propertyActions from '../../redux/modules/entities/properties/actions'
import groupActions from '../../redux/modules/entities/groups/actions'
import accountActions from '../../redux/modules/entities/accounts/actions'

import { getGroups, getBrands, getAccounts } from './menu-selectors'

import {
  VIEW_CONTENT_ACCOUNTS,
  VIEW_CONTENT_GROUPS,
  VIEW_CONTENT_PROPERTIES,
  VIEW_CONTENT_STORAGES } from '../../constants/permissions'

import checkPermissions from '../../util/permissions'

import Selector from '../drillable-menu'

/**
 * dispatch to props for all the other selectors in the app.
 * @param  {[type]} dispatch [description]
 * @param  {[type]} params   [description]
 * @param  {[type]} account  [description]
 * @param  {[type]} group    [description]
 * @param  {[type]} property [description]
 * @return {[type]}          [description]
 */
const accountSelectorDispatchToProps = (dispatch, { params: { brand, account, group, property, storage }, levels = ['brand', 'account', 'group'] }) => {

  return {
    dispatch,
    fetchData: (user, roles) => {
      const canView = (permission) => checkPermissions(roles, user, permission)
      return Promise.all([

        canView(VIEW_CONTENT_ACCOUNTS) && levels.includes('brand') && dispatch(accountActions.fetchAll({ brand })),

        !canView(VIEW_CONTENT_ACCOUNTS) && levels.includes('brand') && dispatch(accountActions.fetchOne({ brand, id: account })),

        canView(VIEW_CONTENT_GROUPS) && levels.includes('account') && account && dispatch(groupActions.fetchAll({ brand, account })),

        canView(VIEW_CONTENT_PROPERTIES) && levels.includes('group') && (property || storage) && dispatch(propertyActions.fetchAll({ brand, account, group }))

        // canView(VIEW_CONTENT_STORAGES) && levels.includes('group') && (property || storage) && dispatch(storageActions.fetchAll({ brand, account, group }))

      ])
    }
  }
}

/**
 * state to props for the account selector
 * @param  {[type]} state        [description]
 * @param  {[type]} params       [description]
 * @param  {[type]} restrictions [description]
 * @return {[type]}              [description]
 */
const accountSelectorStateToProps = (state, { params: { property, group, account, brand }, levels = ['brand', 'account', 'group'] }) => {

  const roles = state.roles.get('roles')
  const user = state.user.get('currentUser')

  const canView = permission => {
    let hasLevel = false

    switch(permission) {

      case VIEW_CONTENT_ACCOUNTS:
        hasLevel = levels.includes('brand')
        break

      case VIEW_CONTENT_GROUPS:
        hasLevel = levels.includes('account')
        break

      case VIEW_CONTENT_STORAGES:
      case VIEW_CONTENT_PROPERTIES:
        hasLevel = levels.includes('group')
        break
    }

    return hasLevel && checkPermissions(roles, user, permission)
  }

  const canViewBrand = canView(VIEW_CONTENT_ACCOUNTS)
  const canViewAccount = canView(VIEW_CONTENT_GROUPS)
  const canViewGroup = canView(VIEW_CONTENT_PROPERTIES)

  let activeNode = brand
  let tree = []

  if (canViewBrand) {

    tree = getBrands(state, brand, canView)

  } else if (canViewAccount) {

    tree = getAccounts(state, { brand }, canView)

  } else if (canViewGroup) {

    tree = getGroups(state, { brand, account }, canView)
  }

  if (canViewBrand && brand) {
    activeNode = brand
  }
  if (canViewAccount && account) {
    activeNode = account
  }
  if (canViewGroup && property) {
    activeNode = group
  }


  return {
    activeNode,
    tree
  }
}

export const AccountSelector = connect(accountSelectorStateToProps, accountSelectorDispatchToProps)(Selector)
