import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  VIEW_CONTENT_GROUPS,
  VIEW_CONTENT_ACCOUNTS,
  VIEW_CONTENT_PROPERTIES,
  LIST_STORAGE } from '../../constants/permissions'

import propertyActions from '../../redux/modules/entities/properties/actions'
import { getByGroup as getPropertiesByGroup } from '../../redux/modules/entities/properties/selectors'

import storageActions from '../../redux/modules/entities/CIS-ingest-points/actions'
import { getByGroup as getStoragesByGroup } from '../../redux/modules/entities/CIS-ingest-points/selectors'

import groupActions from '../../redux/modules/entities/groups/actions'
import { getByAccount } from '../../redux/modules/entities/groups/selectors'

import { getByBrand, getById as getAccountById } from '../../redux/modules/entities/accounts/selectors'

import { accountIsServiceProviderType } from '../../util/helpers'

export const requestTag = 'GAS-REQUEST'

/**
 * get groups from state, set child nodes and define a function to fetch child nodes for each one.
 * @param  {[type]} state   [description]
 * @param  {[type]} parents [description]
 * @param  {[type]} canView [description]
 * @return {[type]}         [description]
 */
export const getGroups = (state, parents, canView) => {

  return getByAccount(state, parents.account).toJS().map(group => {

    const { nodes, headerSubtitle } = getStoragesAndProperties(state, { ...parents, group: String(group.id) }, canView)

    return {
      ...group,
      nodeInfo: {
        headerSubtitle,
        fetchChildren: (dispatch) => Promise.all([
          dispatch(propertyActions.fetchAll({ ...parents, group: String(group.id), requestTag })),
          dispatch(storageActions.fetchAll({ ...parents, group: String(group.id) }))
        ]),
        entityType: 'group',
        parents,
        nodes
      }
    }
  })
}

/**
 * get properties from state, set idKey and labelKey for indentifying label and id
 * @param  {[type]} state   [description]
 * @param  {[type]} parents [description]
 * @return {[type]}         [description]
 */
export const getProperties = (state, parents) => {

  return getPropertiesByGroup(state, parents.group).toJS().map((property) => {

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
 * @param  {[type]} parents [description]
 * @return {[type]}         [description]
 */
export const getStorages = (state, parents) => {

  return getStoragesByGroup(state, parents.group).toJS().map((storage) => {

    return {
      ...storage,
      labelKey: 'ingest_point_id',
      idKey: 'ingest_point_id',
      nodeInfo: {
        entityType: 'storage',
        parents
      }
    }
  })
}

/**
 * get accounts from state, set child nodes and define a function to fetch child nodes for each one.
 * @param  {[type]} state   [description]
 * @param  {[type]} parents [description]
 * @param  {[type]} canView [description]
 * @return {[type]}         [description]
 */
export const getAccounts = (state, parents, canView) => {

  return getByBrand(state, parents.brand).toJS().map(account => {

    const nodes = canView(VIEW_CONTENT_GROUPS) && getGroups(state, { ...parents, account: String(account.id) }, canView)
    const headerSubtitle = <FormattedMessage id="portal.common.group.multiple" values={{numGroups: nodes.length || 0}}/>

    return {
      ...account,
      nodeInfo: {
        headerSubtitle,
        fetchChildren: (dispatch) => dispatch(groupActions.fetchAll({ ...parents, account: String(account.id), requestTag })),
        entityType: 'account',
        parents,
        nodes
      }
    }
  })
}

/**
 * Get brands and set accounts as child nodes
 * @param  {[type]} state   [description]
 * @param  {[type]} canView [description]
 * @return {[type]}         [description]
 */
export const getBrands = (state, canView) => {

  const nodes = canView(VIEW_CONTENT_ACCOUNTS) && getAccounts(state, { brand: 'udn' }, canView)
  const headerSubtitle = <FormattedMessage id="portal.common.account.multiple" values={{numAccounts: nodes.length || 0}}/>
  return [{
    id: 'udn',
    name: 'UDN Admin',
    nodeInfo: {
      headerSubtitle,
      nodes
    }
  }]
}

/**
 * If active account is NOT of service provider type, insert properties and storages
 * into the nodes-array as child nodes for parent group if permitted.
 * @param  {[type]} state   [description]
 * @param  {[type]} canView [description]
 * @param  {[type]} parents [description]
 * @return {[type]}         [description]
 */
const getStoragesAndProperties = (state, parents, canView) => {

  let nodes, headerSubtitle = undefined
  const activeAccount = getAccountById(state, parents.account) || Map()

  if (!accountIsServiceProviderType(activeAccount)) {

    const properties = canView(VIEW_CONTENT_PROPERTIES) && getProperties(state, parents)
    const storages = canView(LIST_STORAGE) && getStorages(state, parents)
    const propertyCount = properties.length
    const storageCount = storages.length

    // If the dropdown can show either entity type, make the nodes-array. Otherwise leave it undefined.
    if (properties || storages) {
      nodes = [
        ...storages,
        ...properties
      ]
    }

    headerSubtitle = (
      <span>
        <FormattedMessage id="portal.common.property.multiple" values={{numProperties: propertyCount}}/>
        <FormattedMessage id="portal.commaWithSpace" /><FormattedMessage id="portal.common.storage.multiple" values={{numStorages: storageCount}}/>
      </span>
    )

  }
  return { nodes, headerSubtitle }
}
