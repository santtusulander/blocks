import { connect } from 'react-redux'

import propertyActions from '../../redux/modules/entities/properties/actions'
import groupActions from '../../redux/modules/entities/groups/actions'
import storageActions from '../../redux/modules/entities/CIS-ingest-points/actions'

import { getById as getAccountById } from '../../redux/modules/entities/accounts/selectors'
import accountActions from '../../redux/modules/entities/accounts/actions'

import { getFetchingByTag } from '../../redux/modules/fetching/selectors'

import { getCurrentUser } from '../../redux/modules/user'

import { getGroups, getBrands, getAccounts, getGroupForPropertyConfig } from './menu-selectors'

import {
  VIEW_CONTENT_ACCOUNTS,
  VIEW_CONTENT_GROUPS,
  VIEW_CONTENT_PROPERTIES,
  LIST_STORAGE } from '../../constants/permissions'

import { checkUserPermissions } from '../../util/permissions'
import { accountIsServiceProviderType } from '../../util/helpers'

import DrillableMenu from '../drillable-menu/menu'

/**
 * Runs check for a permission to determine whether the entity tree
 * passed to the menu component contains entities for a level corresponding that permission.
 * @param  {[Array]}   levels      desired levels for the account selector
 * @param  {[Map]}     user        current active user
 * @param  {[Map]}     account     current active account
 * @param  {[String]}  permission  permission to check against
 * @return Boolean
 */
const permissionCheck = (levels, user, account) => permission => {
  let hasLevel = false
  const accountNotSP = !accountIsServiceProviderType(account)

  switch (permission) {

    case VIEW_CONTENT_ACCOUNTS:
      hasLevel = levels.includes('brand')
      break

    case VIEW_CONTENT_GROUPS:
      hasLevel = levels.includes('account')
      break

    case LIST_STORAGE:
    case VIEW_CONTENT_PROPERTIES:
      hasLevel = levels.includes('group') && accountNotSP
      break
  }

  return hasLevel && checkUserPermissions(user, permission)
}

/**
 * dispatch to props for account selectors
 * @param  {[type]} dispatch [description]
 * @param  {[type]} params   [description]
 * @param  {[type]} levels   [description]
 * @return {[type]}          [description]
 */
const accountSelectorDispatchToProps = dispatch => {

  return {
    dispatch,
    fetchAccounts: brand => dispatch(accountActions.fetchAll({ brand })),
    fetchAccount: (brand, account) => dispatch(accountActions.fetchOne({ brand, id: account })),
    fetchGroups: (brand, account) => dispatch(groupActions.fetchAll({ brand, account })),
    fetchProperties: (brand, account, group) => dispatch(propertyActions.fetchAll({ brand, account, group })),
    fetchStorages: (brand, account, group) => dispatch(storageActions.fetchAll({ brand, account, group }))
  }
}

 /**
  * state to props for the account selector
  * @param  {[type]} state             [description]
  * @param  {[type]} params            [description]
  * @param  {[type]} levels            which levels are set for an instance of the GAS
  * @return {[type]}                   [description]
  */
const accountSelectorStateToProps = (state, { params: { group, account, brand }, levels = ['brand', 'account', 'group'] }) => {

  const canView = permissionCheck(levels, getCurrentUser(state), getAccountById(state, account))

  const canViewBrand = canView(VIEW_CONTENT_ACCOUNTS)
  const canViewAccount = canView(VIEW_CONTENT_GROUPS)
  const canViewGroup = canView(VIEW_CONTENT_PROPERTIES) || canView(LIST_STORAGE)

  let activeNode = brand
  let tree = []

  if (activeNode) {

    if (canViewBrand) {

      tree = getBrands(state, canView)

    } else if (canViewAccount) {

      tree = getAccounts(state, { brand }, canView)

    } else if (canViewGroup) {

      tree = getGroups(state, { brand, account }, canView)
    }
  }

  if (canViewAccount && account) {
    activeNode = account
  }
  if (canViewGroup && group) {
    activeNode = group
  }

  return {
    fetching: getFetchingByTag(state, 'GAS-REQUEST'),
    shouldFetch: canView,
    activeNode,
    tree
  }
}

/**
* mergeProps for the account selector
* @param  {[type]} shouldFetch   permissionCheck curried from stateToProps
* @param  {[type]} stateProps    object returned by stateToProps
* @param  {[type]} dispatchProps object returned by dispatchToProps
* @param  {[type]} params        url params
* @param  {[type]} ownProps
* @return {[type]}               props to pass to the component
*/
const accountSelectorMergeProps = ({ shouldFetch, ...stateProps }, dispatchProps, { params: { brand, account, group }, ...ownProps }) => {
  return {
    ...stateProps,
    ...ownProps,
    dispatch: dispatchProps.dispatch,
    fetchData: () => {

      return Promise.all([

        shouldFetch(VIEW_CONTENT_ACCOUNTS) && brand && dispatchProps.fetchAccounts(brand),

        !shouldFetch(VIEW_CONTENT_ACCOUNTS) && account && dispatchProps.fetchAccount(brand, account),

        shouldFetch(VIEW_CONTENT_GROUPS) && account && dispatchProps.fetchGroups(brand, account),

        shouldFetch(VIEW_CONTENT_PROPERTIES) && group && dispatchProps.fetchProperties(brand, account, group),

        shouldFetch(LIST_STORAGE) && group && dispatchProps.fetchStorages(brand, account, group)

      ])
    }
  }
}

/**
 * dispatch to props for property configuration page account selector
 * @param  {[type]} dispatch [description]
 * @param  {[type]} params   URL params
 * @return {[type]}          [description]
 */
const propertyConfigDispatchToProps = (dispatch, { params }) => {

  return {
    dispatch,
    fetchData: (user) => {
      const shouldFetch = permissionCheck([ 'group' ], user)

      return Promise.all([
        shouldFetch(VIEW_CONTENT_GROUPS) && dispatch(groupActions.fetchOne(params)),
        shouldFetch(VIEW_CONTENT_PROPERTIES) && dispatch(propertyActions.fetchAll(params))
      ])
    }
  }
}

/**
 * state to props for property configuration page account selector
 * excludes storages from group level
 * @param  {[type]} dispatch [description]
 * @param  {[type]} params   URL params
 * @return {[type]}          [description]
 */
const propertyConfigStateToProps = (state, { params }) => {

  const canView = permissionCheck([ 'group' ], getCurrentUser(state))

  const tree = []

  if (canView(VIEW_CONTENT_PROPERTIES)) {
    tree.push(getGroupForPropertyConfig(state, params, canView))
  }

  return {
    fetching: getFetchingByTag(state, 'GAS-REQUEST'),
    activeNode: params.group,
    tree
  }
}

export const PropertyConfigAccountSelector = connect(propertyConfigStateToProps, propertyConfigDispatchToProps)(DrillableMenu)

export default connect(accountSelectorStateToProps, accountSelectorDispatchToProps, accountSelectorMergeProps)(DrillableMenu)
