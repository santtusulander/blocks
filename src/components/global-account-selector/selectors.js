import propertyActions from '../../redux/modules/entities/properties/actions'
import { getByGroup } from '../../redux/modules/entities/properties/selectors'

import groupActions from '../../redux/modules/entities/groups/actions'
import { getByAccount } from '../../redux/modules/entities/groups/selectors'

import { getByBrand } from '../../redux/modules/entities/accounts/selectors'

import { VIEW_CONTENT_ACCOUNTS, VIEW_CONTENT_GROUPS, DENY_ALWAYS } from '../../constants/permissions'


/**
 * get groups from state, setting child nodes and defining a function to fetch child nodes for each one.
 * @param  {[type]} state     [description]
 * @param  {[type]} brandId   [description]
 * @param  {[type]} accountId [description]
 * @return {[type]}           [description]
 */
const getGroups = (state, brandId, accountId) => getByAccount(state, String(accountId)).toJS().map((group) => {
  return {
    ...group,
    nodeInfo: {
      viewParentPermission: VIEW_CONTENT_GROUPS,
      fetchChildren: () => propertyActions.fetchAll({ brand: brandId, account: accountId, group: group.id }),
      entityType: 'group',
      parents: {
        brand: brandId,
        account: accountId
      }
    },
    nodes: getProperties(state, brandId, accountId, group.id)
  }
})

/**
 * get properties from state
 * @param  {[type]} state   [description]
 * @param  {[type]} groupId [description]
 * @return {[type]}         [description]
 */
const getProperties = (state, brandId, accountId, groupId) => getByGroup(state, String(groupId)).toJS().map((property) => {

  return {
    ...property,
    idKey: 'published_host_id',
    labelKey: 'published_host_id',
    nodeInfo: {
      viewParentPermission: VIEW_CONTENT_GROUPS,
      entityType: 'property',
      parents: {
        brand: brandId,
        account: accountId,
        group: groupId
      }
    }
  }
})

/**
* get accounts from state, setting child nodes and defining a function to fetch child nodes for each one.
* @param  {[type]}  state      [description]
* @param  {[type]}  brand      [description]
* @param  {Boolean} isTopLevel [description]
* @return {[type]}             [description]
*/
export const getAccounts = (state, brand, canDrill = true) => getByBrand(state, brand).toJS().map(account => {
  return {
    ...account,
    nodeInfo: {
      viewParentPermission: VIEW_CONTENT_ACCOUNTS,
      fetchChildren: () => groupActions.fetchAll({ brand: brand, account: account.id }),
      entityType: 'account',
      parents: {
        brand
      }
    },
    nodes: canDrill && getGroups(state, brand, account.id)
  }
})
