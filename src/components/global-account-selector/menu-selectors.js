import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  VIEW_CONTENT_GROUPS,
  VIEW_CONTENT_ACCOUNTS,
  VIEW_CONTENT_PROPERTIES,
  VIEW_CONTENT_STORAGES } from '../../constants/permissions'

import propertyActions from '../../redux/modules/entities/properties/actions'
import { getByGroup as getPropertiesByGroup } from '../../redux/modules/entities/properties/selectors'

import groupActions from '../../redux/modules/entities/groups/actions'
import { getByAccount } from '../../redux/modules/entities/groups/selectors'

import { getByBrand, getById as getAccountById } from '../../redux/modules/entities/accounts/selectors'

import { accountIsServiceProviderType } from '../../util/helpers'

const getStoragesByGroup = () => ([
  {
    "id": 'A Mock Storage',
    "estimated_usage": 999999,
    "usage": 2932224,
    "clusters": ["strg0"]
  }
])

/**
 * get groups from state, set child nodes and defining a function to fetch child nodes for each one.
 * @param  {[type]} state     [description]
 * @param  {[type]} brandId   [description]
 * @param  {[type]} accountId [description]
 * @return {[type]}           [description]
 */
export const getGroups = (state, parents, canView) => {

  return getByAccount(state, parents.account).toJS().map(group => {

    const { nodes, headerSubtitle } = getStoragesAndProperties(state, canView, { ...parents, group: group.id })

    return {
      ...group,
      nodeInfo: {
        headerSubtitle,
        fetchChildren: (dispatch) => Promise.all([
          dispatch(propertyActions.fetchAll({ ...parents, group: group.id }))
          // dispatch(storageActions.fetchAll({ ...parents, group: group.id }))
        ]),
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
 * get accounts from state, set child nodes and defining a function to fetch child nodes for each one.
 * @param  {[type]} state     [description]
 * @param  {[type]} parents   [description]
 * @param  {Object} [hide={}] [description]
 * @return {[type]}           [description]
 */
export const getAccounts = (state, parents, canView) => {

  return getByBrand(state, parents.brand).toJS().map(account => {

    const nodes = canView(VIEW_CONTENT_GROUPS) && getGroups(state, { ...parents, account: account.id }, canView)

    const headerSubtitle = <FormattedMessage id="portal.common.group.multiple" values={{numGroups: nodes.length || 0}}/>

    return {
      ...account,
      nodeInfo: {
        headerSubtitle,
        fetchChildren: (dispatch) => dispatch(groupActions.fetchAll({ ...parents, account: account.id })),
        entityType: 'account',
        parents,
        nodes
      }
    }
  })
}

export const getBrands = (state, brand, canView) => {

  const nodes = canView(VIEW_CONTENT_ACCOUNTS) && getAccounts(state, { brand }, canView)
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

/**
 * If active account is of service provider type, it should not have a group level.
 * Otherwise get storages and properties from store
 * @param  {[type]} state   [description]
 * @param  {[type]} canView [description]
 * @param  {[type]} parents [description]
 * @return {[type]}         [description]
 */
const getStoragesAndProperties = (state, canView, parents) => {

  let nodes, headerSubtitle = undefined
  let activeAccount = getAccountById(state, parents.account)

  if (!accountIsServiceProviderType(activeAccount)) {

    const properties = canView(VIEW_CONTENT_PROPERTIES) && getProperties(state, parents)
    const storages = canView(VIEW_CONTENT_STORAGES) && getStorages(state, parents)

    nodes = [
      ...properties,
      ...storages
    ]

    headerSubtitle = (
      <span>
        <FormattedMessage id="portal.common.property.multiple" values={{numProperties: properties.length || 0}}/>, <FormattedMessage id="portal.common.storage.multiple" values={{numStorages: storages.length || 0}}/>
      </span>
    )

  }

  return { nodes, headerSubtitle }
}
