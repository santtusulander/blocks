import uniqid from 'uniqid'

const actionTypes = {
  REQUEST: 'entities/REQUEST',
  RECEIVE: 'entities/RECEIVE',
  REMOVE: 'entities/REMOVE',
  FAIL: 'entities/FAIL'
}

const getPayload = requestTag => {
  const requestId = uniqid()
  return {
    [requestId]: { requestTag }
  }
}

export default ({
  api,
  entityType,
  receiveActionTypes = [actionTypes.REQUEST, actionTypes.RECEIVE, actionTypes.FAIL],
  removeActionTypes = [actionTypes.REQUEST, actionTypes.REMOVE, actionTypes.FAIL]
}) => {
  const [ request, receive, fail ] = receiveActionTypes

  const fetchOne = ({ forceReload, requestTag, ...requestParams }) => {
    return {
      forceReload,
      payload: getPayload(requestTag || entityType),
      types: receiveActionTypes,
      cacheKey: `fetch-one-${entityType}-${JSON.stringify(requestParams)}`,
      callApi: () => {
        return api.fetch(requestParams)
      }
    }
  }

  const fetchByIds = dispatch => ({ requestTag, ...requestParams }) => {

    const thunkPayload = getPayload(requestTag || entityType)

    dispatch({
      type: request,
      payload: thunkPayload
    })

    return api.fetchIds(requestParams)
      .then((data) => {

        if (!Array.isArray(data)) {
          throw new Error('Expected fetchIds to resolve with an array of IDs. ' + typeof data + ' passed instead.')
        }

        dispatch({ type: receive, payload: thunkPayload })

        return data.forEach(id => {

          dispatch(fetchOne({ requestTag, ...requestParams, id }))

        })
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
        dispatch({ type: fail, payload: thunkPayload })
      })
  }

  return {

    fetchAllThunk: dispatch => params => {
      console.warn('fetchAllThunk is deprecated. Use fetchByIds instead.')
      return fetchByIds(dispatch)(params)
    },

    fetchByIds,

    fetchOne,

    fetchAll: ({ forceReload, requestTag, ...requestParams }) => ({
      forceReload,
      payload: getPayload(requestTag || entityType),
      types: receiveActionTypes,
      cacheKey: `fetch-all-${entityType}-${JSON.stringify(requestParams)}`,
      callApi: () => api.fetchAll(requestParams)
    }),

    create: ({ requestTag, ...requestParams }) => ({
      payload: getPayload(requestTag || entityType),
      types: receiveActionTypes,
      callApi: () => api.create(requestParams)
    }),

    update: ({ requestTag, ...requestParams }) => ({
      payload: getPayload(requestTag || entityType),
      types: receiveActionTypes,
      callApi: () => api.update(requestParams)
    }),

    remove: ({ requestTag, ...requestParams }) => ({
      payload: getPayload(requestTag || entityType),
      types: removeActionTypes,
      callApi: () => api.remove(requestParams)
    })

  }
}
