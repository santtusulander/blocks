import uniqid from 'uniqid'

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
export const createSuccess = (state, {payload: {data}}) => {
  return state.merge( {loading: false, resources: state.get('resources').push( data.set('id', uniqid() ) ) } );
}

export const createFailed = (state, action) => {
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
export const updateSuccess = (state, {payload: {data}}) => {
  const index = state.get('resources').findIndex( record => record.get('id') === data.id)

  return state.merge( {loading: false, resources: state.get('resources').set(index, data) })
}
export const updateFailed = (state) => {
  return state
}

//DELETE
export const deleteSuccess = (state, {payload: {data}}) => {
  const index = state.get('resources').findIndex( record => record.get('id') === data.id)
  return state.merge( {loading: false, resources: state.get('resources').delete( index ) })
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
export const setActive = (state, {payload: {data: {id} } }) => {
  return state.set('activeRecord', id)
}

