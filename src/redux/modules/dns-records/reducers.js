import { fromJS } from 'immutable'

//REDUCERS
export const receiveResourcesList = (state, action ) => {
  //TODO: Maybe we should check if record already found with rr field and not merge these records?
  return state.merge({
    resources: action.payload.data.map( zone => ({ name: zone} ) ),
    loading: false
  })
}

export function failedResourcesList( state ){
  return state
}

export const receiveResourceDetails = (state, action) => {
  const resourceObj = [{
    name: action.payload.resource,
    rr: action.payload.data
  }]

  const resources = state.get('resources')
  const newRes = resources.merge(resourceObj)

  return state.merge( { resources: newRes } )
}

export function failedResourceDetails( state ){
  return state
}


