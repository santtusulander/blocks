import * as api from './api'
import actionCreatorBuilder from '../action-creators'

export default actionCreatorBuilder({entityType: 'properties', api})

// //import {createAction} from 'redux-actions'
// import * as api from './api'
// import {actionTypes} from '../index'
// //import {fetchAll as fetchAllGroups} from '../groups/actions'
// //import {fetch as fetchAccount} from '../accounts/actions'
// //
// //
// export const fetch = (brand, account, group, propertyId, cacheSelector ) => {
//
//   return {
//     types: [actionTypes.REQUEST, actionTypes.RECEIVE, actionTypes.FAIL],
//     shouldCallApi: cacheSelector, //state => state.entities.entities.properties,
//     callApi: () => { return api.fetch(brand, account, group, propertyId) }
//   }
// }
//
// //export fetchAll =
//
//
// export const fetchAllWithDetails = (brand, account, group, cacheSelector ) => {
//
//   return {
//     types: [actionTypes.REQUEST, actionTypes.RECEIVE, actionTypes.FAIL],
//     shouldCallApi: cacheSelector,
//     callApi: () => { return api.fetchAllWithDetails(brand, account, group) }
//   }
// }
//
// /*actions creators*/
// export const startFetching = createAction(actionTypes.START_FETCHING)
//
// export const fetch = createAction(actionTypes.FETCH, (brand, account, group, id) => {
//   return api.fetch( brand, account, group, id)
// })
//
// export const fetchAll = createAction(actionTypes.FETCH_ALL, (brand, account, group) => {
//   return api.fetchAll( brand, account, group)
// })
//
// export const fetchAllWithDetails = (brand, account, group) => (dispatch, getState) => {
//   if (!account) throw new Error("fetchAllWithDetails - error 'account' is empty. Cannot call fetchAll groups")
//
//   if ( !getState().entities.entities.accounts.get(String(account)) ) dispatch( fetchAccount(brand, account) )
//   else console.log('Account is cached!');
//
//   const groupPromise = () => {
//     if (group) {
//       return Promise.resolve({payload: {entities: { accountGroups: {[account]: {groups: [group]}} }}})
//     } else
//       return dispatch( fetchAllGroups(brand, account) )
//   }
//
//   return groupPromise()
//     .then( (data) => {
//       const groupsIds = data.payload.entities.accountGroups[account].groups || []
//
//       // get published hosts for each group
//       return Promise.all( groupsIds.map( group => {
//         return dispatch( fetchAll( brand, account, group) )
//           .then( (data) => {
//             //fetch details for each host
//             return Promise.all( data.payload.entities.groupProperties[group].properties.map( id => {
//               if ( !getState().entities.entities.properties.get(String(id))) return dispatch( fetch( brand, account, group, id) )
//               else console.log("Using cached propety data for", id)
//             }))
//           })
//       }))
//     })
// }
//
// //TODO: Call api
// export const remove = createAction(actionTypes.REMOVE, (brand, account, group, id) => {
//   return Promise.resolve(id)
// })
//
// //TODO: Call api
// export const create = createAction(actionTypes.CREATE, (brand, account, group, data) => {
//   return Promise.resolve(data)
// })
//
// //TODO: Call api
// export const update = createAction(actionTypes.UPDATE, (brand, account, group, id, data) => {
//   return Promise.resolve(id, data)
// })
