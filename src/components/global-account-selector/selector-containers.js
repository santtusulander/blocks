import { connect } from 'react-redux'

import propertyActions from '../../redux/modules/entities/properties/actions'
import groupActions from '../../redux/modules/entities/groups/actions'
import accountActions from '../../redux/modules/entities/accounts/actions'

import { getGroups, getBrands, getAccounts } from './selectors'

import { getById as getGroupById } from '../../redux/modules/entities/groups/selectors'
import { getById as getAccountById } from '../../redux/modules/entities/accounts/selectors'

import { VIEW_CONTENT_ACCOUNTS, VIEW_CONTENT_GROUPS, VIEW_CONTENT_PROPERTIES } from '../../constants/permissions'
import checkPermissions from '../../util/permissions'

import Selector from './global-account-selector'

/**
 * dispatch to props for top header admin account selector.
 * @param  {[type]} dispatch [description]
 * @param  {[type]} params   [description]
 * @return {[type]}          [description]
 */
const adminAccountSelectorDispatchToProps = (dispatch, { params: { brand } }) => {

  return {
    dispatch,
    fetchData: () => dispatch(accountActions.fetchAll({ brand }))
  }
}

/**
 * dispatch to props for all the other selectors in the app.
 * @param  {[type]} dispatch [description]
 * @param  {[type]} params   [description]
 * @param  {[type]} account  [description]
 * @param  {[type]} group    [description]
 * @param  {[type]} property [description]
 * @return {[type]}          [description]
 */
const accountSelectorDispatchToProps = (dispatch, { params: { brand, account, group, property }, has = ['brand', 'account', 'group'] }) => {

  return {
    dispatch,
    fetchData: (user, roles) => {
      const canView = (permission) => checkPermissions(roles, user, permission)

      return Promise.all([

        canView(VIEW_CONTENT_ACCOUNTS) && has.includes('brand') && dispatch(accountActions.fetchAll({ brand })),

        !canView(VIEW_CONTENT_ACCOUNTS) && has.includes('brand') && dispatch(accountActions.fetchOne({ brand, id: account })),

        canView(VIEW_CONTENT_GROUPS) && has.includes('account') && account && dispatch(groupActions.fetchAll({ brand, account })),

        canView(VIEW_CONTENT_PROPERTIES) && has.includes('group') && property && propertyActions.fetchByIds(dispatch)({ brand, account, group })

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
const accountSelectorStateToProps = (state, { params: { property, group, account, brand }, has = ['brand', 'account', 'group'] }) => {

  const canView = permission => checkPermissions(state.roles.get('roles'), state.user.get('currentUser'), permission)

  const hasBrand = has.includes('brand') && canView(VIEW_CONTENT_ACCOUNTS)
  const hasAccount = has.includes('account') && canView(VIEW_CONTENT_GROUPS)
  const hasGroup = has.includes('group') && canView(VIEW_CONTENT_PROPERTIES)

  let activeNode = brand
  let tree = []

  const getSingleGroup = (state, parents, callBack) => ([ getGroupById(state, group).toJS() ].map(callBack))
  const getSingleAccount = (state, parents, callBack) => ([ getAccountById(state, account).toJS() ].map(callBack))

  if (hasBrand) {

    tree = getBrands(state, brand, has)

  } else if (hasAccount) {

    tree = getAccounts(state, { brand }, has, getSingleAccount)

  } else if (hasGroup) {

    tree = getGroups(state, { brand, account }, has, getSingleGroup)
  }

  if (hasBrand && brand) {
    activeNode = brand
  }
  if (hasAccount && account) {
    activeNode = account
  }
  if (hasGroup && property) {
    activeNode = group
  }


  return {
    activeNode,
    tree
  }
}

export const AccountSelector = connect(accountSelectorStateToProps, accountSelectorDispatchToProps)(Selector)
export const AdminAccountSelector = connect(accountSelectorStateToProps, adminAccountSelectorDispatchToProps)(Selector)
