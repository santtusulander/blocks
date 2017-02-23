import { List } from 'immutable'
import {getEntityById, getEntitiesByParent} from '../../entity/selectors'

/**
 * Get property by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  return getEntityById(state, 'properties', id)
}

/**
 * Get Properties By Group
 * @param  {} state
 * @param  {String} brand [description]
 * @return List
 */
export const getByGroup = (state, group) => {
  return getEntitiesByParent(state, 'properties', group)
}

/**
 * Get Properties By Account
 * @param  {} state
 * @param  {String} account ID
 * @return List
 */
export const getByAccount = (state, account) => {
  const groups = getEntitiesByParent(state, 'groups', account)

  if (groups && groups.size > 0) {
    return groups.reduce((acc, g) => {
      const groupProperties = getByGroup(state, g.get('id'))
      return acc.merge( groupProperties )
    }, List())
  }

}
