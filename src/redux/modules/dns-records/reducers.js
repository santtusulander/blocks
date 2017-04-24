import uniqid from 'uniqid'
import { fromJS } from 'immutable'

/* NOT NEEDED AT THE MOMENT as details are fetched with receiveWithDetails
//LIST
export const receiveResourcesList = (state, action ) => {
  //TODO: Maybe we should check if record already found with rr field and not merge these records?
  return state.merge({
    //resources: action.payload.data.map( zone => ({ name: zone} ) ),
    fetching: false
  })
}

//DETAILS

export const resourcesListFailed = ( state ) => {
  return state.merge( {fetching: false })
}

export const receiveResourceDetails = (state, action) => {
  const resourceObj = [{
    id: uniqid(),
    name: action.payload.resource,
    rr: action.payload.data
  }]

  const resources = state.get('resources')
  const newRes = resources.merge(resourceObj)

  return state.merge( { resources: newRes, fetching: false } )
}*/

//CREATE
export const createSuccess = (state, { payload: { data } }) => {
  data.id = uniqid()
  return state.merge({ resources: state.get('resources').push(fromJS(data)), fetching: false });
}

export const createFailed = (state) => {
  return state.set('fetching', false)
}

//LIST WITH DETAILS
export const receiveWithDetails = (state, action) => {
  return state.merge({resources: action.payload, fetching: false})
}

export const receiveWithDetailsFailed = (state) => {
  return state.set('fetching', false)
}

export const resourceDetailsFailed = (state) => {
  return state.set('fetching', false)
}

//UPDATE
export const updateSuccess = (state, { payload: { data, id } }) => {
  const index = state.get('resources').findIndex(record => record.get('id') === id)
  return state.merge({fetching: false, resources: state.get('resources').set(index, fromJS(data)) })
}

export const updateFailed = (state) => {
  return state.set('fetching', false)
}

//DELETE
export const deleteSuccess = (state, { payload }) => {
  const index = state.get('resources').findIndex(record => record.get('id') === payload)
  return state.merge({ resources: state.get('resources').delete(index), fetching: false })
}
export const deleteFailed = (state) => {
  return state.set('fetching', false)
}

//START / STOP FETCH
export const startedFetching = (state) => {
  return state.merge({ fetching: true })
}

export const stoppedFetching = (state) => {
  return state.merge({ fetching: false })
}

//SET ACTIVE
export const setActive = (state, { payload }) => {
  return state.set('activeRecord', payload)
}

