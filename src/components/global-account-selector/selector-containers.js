import { connect } from 'react-redux'

import propertyActions from '../../redux/modules/entities/properties/actions'
import groupActions from '../../redux/modules/entities/groups/actions'
import accountActions from '../../redux/modules/entities/accounts/actions'

import { getAccounts } from './selectors'

import { DENY_ALWAYS } from '../../constants/permissions'

import Selector from './global-account-selector'

/**
 * redux mapper functions for drillable account selectors
 * @param  {[type]} state    [description]
 * @param  {[type]} params   [description]
 * @param  {[type]} account  [description]
 * @param  {[type]} group    [description]
 * @param  {[type]} property [description]
 * @return {[type]}          [description]
 */
const drillableStateToProps = (state, { params: { brand, account, group, property } }) => {
  return {
    activeNode: property ? group : account || brand,
    tree: [{
      id: brand,
      name: 'UDN Admin',
      nodeInfo: {
        viewParentPermission: DENY_ALWAYS
      },
      nodes: getAccounts(state, brand)
    }]
  }
}

const drillableDispatchToProps = (dispatch, { params: { brand, account, group, property } }) => {

  return {
    dispatch,
    fetchData: () => {
      const fetchArray = []

      fetchArray.push(dispatch(accountActions.fetchAll({ brand })))
      property && fetchArray.push(dispatch(propertyActions.fetchAll({ brand, account, group })))
      group && fetchArray.push(dispatch(groupActions.fetchAll({ brand, account })))
      return Promise.all(fetchArray)
    }
  }
}

/**
* redux mapper functions for UDN admin level account selectors in the top header
* @param  {[type]} dispatch [description]
* @param  {[type]} params   [description]
* @param  {[type]} account  [description]
* @param  {[type]} group    [description]
* @param  {[type]} property [description]
* @return {[type]}          [description]
*/
const topLevelStateToProps = (state, { params: { brand } }) => {

  return {
    activeNode: brand,
    tree: [{
      id: brand,
      name: 'UDN Admin',
      nodeInfo: {
        viewParentPermission: DENY_ALWAYS
      },
      nodes: getAccounts(state, brand, false)
    }]
  }
}

const topLevelDispatchToProps = (dispatch, { params: { brand } }) => {

  return {
    dispatch,
    fetchData: () => {
      return dispatch(accountActions.fetchAll({ brand }))
    }
  }
}

/**
* Export the drillable account selector.
* @type {[type]}
*/
export const DrillableAccountSelector = connect(drillableStateToProps, drillableDispatchToProps)(Selector)

/**
 * Export the top-level admin account selector
 * @type {[type]}
 */
export const AdminAccountSelector = connect(topLevelStateToProps, topLevelDispatchToProps)(Selector)
