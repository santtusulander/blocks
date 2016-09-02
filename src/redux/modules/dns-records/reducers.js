import uniqid from 'uniqid'
import { fromJS } from 'immutable'

/* NOT NEEDED AT THE MOMENT as details are fetched with receiveWithDetails
//LIST
export const receiveResourcesList = (state, action ) => {
  //TODO: Maybe we should check if record already found with rr field and not merge these records?
  return state.merge({
    //resources: action.payload.data.map( zone => ({ name: zone} ) ),
    loading: false
  })
}

//DETAILS

export const resourcesListFailed = ( state ) => {
  return state.merge( {loading: false })
}

export const receiveResourceDetails = (state, action) => {
  const resourceObj = [{
    id: uniqid(),
    name: action.payload.resource,
    rr: action.payload.data
  }]

  const resources = state.get('resources')
  const newRes = resources.merge(resourceObj)

  return state.merge( { resources: newRes, loading: false } )
}*/

//CREATE
export const createSuccess = (state, { payload: { data } }) => {
  data.id = uniqid()
  return state.merge({ resources: state.get('resources').push(fromJS(data)) });
}

export const createFailed = (state) => {
  return state
}

//LIST WITH DETAILS
export const receiveWithDetails = (state, action) => {
  return state.merge( {resources: action.payload, loading: false})
}

export const receiveWithDetailsFailed = (state) => {
  return state
}

export const resourceDetailsFailed = ( state ) => {
  return state.set('loading', false)
}

//UPDATE
export const updateSuccess = (state, {payload: { data, id }}) => {
  const index = state.get('resources').findIndex( record => record.get('id') === id)
  return state.merge( {loading: false, resources: state.get('resources').set(index, fromJS(data)) })
}
export const updateFailed = (state) => {
  return state.set('loading', false)
}

//DELETE
export const deleteSuccess = (state, { payload }) => {
  const index = state.get('resources').findIndex( record => record.get('id') === payload)
  return state.merge( { resources: state.get('resources').delete( index ) })
}
export const deleteFailed = (state) => {
  return state
}

//START / STOP FETCH
export const startedFetching = (state) => {
  return state.merge({ loading: true })
}

export const stoppedFetching = (state) => {
  return state.merge({ loading: false })
}

//SET ACTIVE
export const setActive = (state, { payload }) => {
  return state.set('activeRecord', payload)
}

