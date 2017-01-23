import { actionTypes } from './'

export default ({
  api,
  entityType,
  receiveActionTypes = [actionTypes.REQUEST, actionTypes.RECEIVE, actionTypes.FAIL],
  removeActionTypes = [actionTypes.REQUEST, actionTypes.REMOVE, actionTypes.FAIL]
}) => {

  const fetchOne = ({ forceReload, entityType, ...requestParams }) => {
    return {
      forceReload,
      types: receiveActionTypes,
      cacheKey: `fetch-one-${entityType}-${JSON.stringify(requestParams)}`,
      callApi: () => {
        return api.fetch(requestParams)
      }
    }
  }

  const fetchAllThunk = dispatch => requestParams => {
    dispatch({ type: actionTypes.REQUEST })
    return api.fetchAll(requestParams)
      .then(data => {

        if (!Array.isArray(data)) {
          throw new Error('Expected fetchAll to resolve with an array of IDs. ' + typeof data + ' passed instead.')
        }

        dispatch({ type: actionTypes.RECEIVE })

        return data.forEach(id => {

          dispatch(fetchOne({ ...requestParams, id }))

        })
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(err);
        dispatch({ type: actionTypes.FAIL })
      })
  }

  return {

    fetchAllThunk,

    fetchOne,

    fetchAll: ({ forceReload, ...requestParams }) => ({
      forceReload,
      types: receiveActionTypes,
      cacheKey: `fetch-all-${entityType}-${JSON.stringify(requestParams)}`,
      callApi: () => api.fetchAll(requestParams)
    }),

    create: (requestParams) => ({
      types: receiveActionTypes,
      callApi: () => api.create(requestParams)
    }),

    update: (requestParams) => ({
      types: receiveActionTypes,
      callApi: () => api.update(requestParams)
    }),

    remove: (requestParams) => ({
      types: removeActionTypes,
      callApi: () => api.remove(requestParams)
    })

  }
}
