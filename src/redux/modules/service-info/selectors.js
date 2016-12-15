// //import {getFetching} from '../fetching/selectors'
// //import {getEntityById, getEntitiesByParent} from '../../entity/selectors'
// //import {flatten} from '../../../../util/helpers'
// //const STATEPART = 'accounts'
//
// export const getByAccount = (state, accountId) => {
//
//   const ids = state.entities.entities.accountGroups.getIn([String(accountId), 'groups'])
//
//   return ids && ids.reduce( (result, id) => {
//     const res = getById(state, id)
//     if (res) return result.concat(res.toJS())
//
//     return result
//   }, [])
// }
//
//
//
/***
 * Get property by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} property
 */
export const getById = (state, id) => {
  const prop =  state.entities.entities.groups.get(String(id))
  if (prop) return prop

  return null
}

/***
 * Get Provider Types
 * @param  {} state from redux
 * @return []
 */
export const getProviderTypeOptions = (state) => {
  return state.serviceInfo.providerTypes.reduce( (acc, type) => {
    acc.push({
      label: `${type.get('name')} Provider`,
      value: type.get('id')
    })

    return acc
  }, [])
}

export const getServiceOptions = (state, providerType) => {
  if (!providerType || providerType === "") return

  const providerServices = state.serviceInfo.providerTypes.getIn([String(providerType), 'services'])

  return providerServices && providerServices.reduce( (acc, serviceId) => {
    const service = state.serviceInfo.services.get(String(serviceId))

    acc.push({
      label: service.get('name'),
      value: service.get('id'),
      options: service.get('options').reduce( (opts, option) => {
        opts.push({
          label: option.get('name'),
          value: option.get('id')
        })
        return opts
      }, [])
    })

    return acc
  }, [])
}

// /**
//  * isFetching ?
//  * @param  {}  state
//  * @return Boolean
//  */
// export const isFetching = (state) => {
//   return getFetching(state.entities.fetching)
// }
