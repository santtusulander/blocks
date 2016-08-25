//CREATE
export const createSuccess = (state, {payload: {resource, data}}) => {
  const index = state.get('domains').findIndex(item => item.get('id') === resource)
  return state.merge({
    resources: state.get('resources').set(index, {rr: data, name: resource})
  })
}

export const createFailed = (state, action) => {
  return state
}

//LIST
export const receiveResourcesList = (state, action ) => {
  //TODO: Maybe we should check if record already found with rr field and not merge these records?
  return state.merge({
    resources: action.payload.data.map( zone => ({ name: zone} ) ),
    loading: false
  })
}

export const resourcesListFailed = ( state ) => {
  return state.merge( {resources: [], loading: false })
}

//DETAILS
export const receiveResourceDetails = (state, action) => {
  const resourceObj = [{
    name: action.payload.resource,
    rr: action.payload.data
  }]

  const resources = state.get('resources')
  const newRes = resources.merge(resourceObj)

  return state.merge( { resources: newRes, loading: false } )
}

//LIST WITH DETAILS
export const receiveWithDetails = (state, action) => {
  return state.merge( {resources: action.payload, loading: false})
}

export const receiveWithDetailsFailed = (state) => {
  return state
}

//TODO: Should decide how to handle fail?
export const resourceDetailsFailed = ( state , action) => {
  return state.set('loading', false)
}

//TODO: UPDATE
export const updateSuccess = (state, action) => {
  return state
}
export const updateFailed = (state, action) => {
  return state
}

//TODO: DELETE
export const deleteSuccess = (state, action) => {
  return state
}
export const deleteFailed = (state, action) => {
  return state
}

//START / STOP FETCH
export const startedFetching = (state) => {
  return state.merge({ loading: true })
}

export const stoppedFetching = (state) => {
  return state.merge({ loading: false })
}
