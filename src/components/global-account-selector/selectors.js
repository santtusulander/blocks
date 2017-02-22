import React from 'react'
import { FormattedMessage } from 'react-intl'

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
const getGroups = (state, parents, hide) => {

  return getByAccount(state, String(parents.account)).toJS().map((group) => {

    const nodes = !hide.group.childCarets && getProperties(state, { ...parents, group: group.id })
    const headerSubtitle = <FormattedMessage id="portal.common.property.multiple" values={{numProperties: nodes.length || 0}}/>

    return {
      ...group,
      nodeInfo: {
        headerSubtitle,
        showBackCaretPermission: hide.group.backCaret ? DENY_ALWAYS : VIEW_CONTENT_GROUPS,
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
const getProperties = (state, parents) => {

  return getByGroup(state, String(parents.group)).toJS().map((property) => {

    return {
      ...property,
      idKey: 'published_host_id',
      labelKey: 'published_host_id',
      nodeInfo: {
        showBackCaretPermission: VIEW_CONTENT_GROUPS,
        entityType: 'property',
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
export const getAccounts = (state, parents, hide) => {

  return getByBrand(state, parents.brand).toJS().map(account => {

    const nodes = !hide.account.childCarets && getGroups(state, { ...parents, account: account.id }, hide)
    const headerSubtitle = <FormattedMessage id="portal.common.group.multiple" values={{numGroups: nodes.length || 0}}/>

    return {
      ...account,
      nodeInfo: {
        headerSubtitle,
        showBackCaretPermission: hide.account.backCaret ? DENY_ALWAYS : VIEW_CONTENT_ACCOUNTS,
        fetchChildren: () => groupActions.fetchAll({ ...parents, account: account.id }),
        entityType: 'account',
        parents,
        nodes
      }
    }
  })
}
