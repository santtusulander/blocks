import React from 'react'
import { FormattedMessage } from 'react-intl'

import propertyActions from '../../redux/modules/entities/properties/actions'
import { getByGroup as getPropertiesByGroup } from '../../redux/modules/entities/properties/selectors'

import groupActions from '../../redux/modules/entities/groups/actions'
import { getByAccount } from '../../redux/modules/entities/groups/selectors'

import { getByBrand } from '../../redux/modules/entities/accounts/selectors'

const getStoragesByGroup = () => ([
  {
    "id": 'storage123',
    "estimated_usage": 999999,
    "usage": 2932224,
    "clusters": ["strg0"]
  }
])

const getGroupsForAccount = (state, parents, callBack) => getByAccount(state, parents.account).toJS().map(callBack)
const getAccountsForBrand = (state, parents, callBack) => getByBrand(state, parents.brand).toJS().map(callBack)

/**
 * get groups from state, setting child nodes and defining a function to fetch child nodes for each one.
 * @param  {[type]} state     [description]
 * @param  {[type]} brandId   [description]
 * @param  {[type]} accountId [description]
 * @return {[type]}           [description]
 */
export const getGroups = (state, parents, levels, callBack = getGroupsForAccount) => {

  return callBack(state, parents, (group) => {

    const { nodes, headerSubtitle } = getStoragesAndProperties(state, levels, { ...parents, group: group.id })

    return {
      ...group,
      nodeInfo: {
        headerSubtitle,
        fetchChildren: () => propertyActions.fetchAll({ ...parents, group: group.id }),
        entityType: 'group',
        parents,
        nodes
      }
    }
  })
}

/**
 * get properties from state
 * @param  {[type]} state   [description]
 * @param  {[type]} groupId [description]
 * @return {[type]}         [description]
 */
export const getProperties = (state, parents) => {

  return getPropertiesByGroup(state, String(parents.group)).toJS().map((property) => {

    return {
      ...property,
      idKey: 'published_host_id',
      labelKey: 'published_host_id',
      nodeInfo: {
        entityType: 'property',
        parents
      }
    }
  })
}

/**
 * get storages from state
 * @param  {[type]} state   [description]
 * @param  {[type]} groupId [description]
 * @return {[type]}         [description]
 */
export const getStorages = (state, parents) => {

  return getStoragesByGroup(state, String(parents.group)).map((storage) => {

    return {
      ...storage,
      labelKey: 'id',
      nodeInfo: {
        entityType: 'storage',
        parents
      }
    }
  })
}

/**
 * get accounts from state, setting child nodes and defining a function to fetch child nodes for each one.
 * @param  {[type]} state     [description]
 * @param  {[type]} parents   [description]
 * @param  {Object} [hide={}] [description]
 * @return {[type]}           [description]
 */
export const getAccounts = (state, parents, levels, callBack = getAccountsForBrand) => {
  return callBack(state, parents, account => {

    const nodes = levels.includes("account") && getGroups(state, { ...parents, account: account.id }, levels)

    const headerSubtitle = <FormattedMessage id="portal.common.group.multiple" values={{numGroups: nodes.length || 0}}/>

    return {
      ...account,
      nodeInfo: {
        headerSubtitle,
        fetchChildren: () => groupActions.fetchAll({ ...parents, account: account.id }),
        entityType: 'account',
        parents,
        nodes
      }
    }
  })
}

export const getBrands = (state, brand, levels) => {

  const nodes = levels.includes('brand') && getAccounts(state, { brand }, levels)
  const headerSubtitle = <FormattedMessage id="portal.common.account.multiple" values={{numAccounts: nodes.length || 0}}/>
  return [{
    id: brand,
    name: 'UDN Admin',
    nodeInfo: {
      headerSubtitle,
      nodes
    }
  }]
}

const getStoragesAndProperties = (state, levels, parents) => {
  const properties = getProperties(state, parents)
  const storages = getStorages(state, parents)

  const nodes = levels.includes("group") && [
    ...properties,
    ...storages
  ]

  const headerSubtitle = (
    <span>
      <FormattedMessage id="portal.common.property.multiple" values={{numProperties: properties.length || 0}}/>, <FormattedMessage id="portal.common.storage.multiple" values={{numStorages: storages.length || 0}}/>
    </span>
  )

  return { nodes, headerSubtitle }
}
