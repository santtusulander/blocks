import { actionTypes } from './'

export default ({
  api,
  entityType,
  receiveActionTypes = [actionTypes.REQUEST, actionTypes.RECEIVE, actionTypes.FAIL],
  removeActionTypes = [actionTypes.REQUEST, actionTypes.REMOVE, actionTypes.FAIL]
}) => {

  const fetchOne = (forceReload, ...requestParameters) => ({
    forceReload,
    types: receiveActionTypes,
    cacheKey: `fetch-one-${entityType}-${requestParameters.join('-')}`,
    callApi: () => api.fetch(...requestParameters)
  })

  const fetchAllThunk = dispatch => (...requestParameters) => {
    dispatch({ type: actionTypes.REQUEST })
    return api.fetchAll(...requestParameters)
      .then(data =>
        data.map(id => dispatch(fetchOne(...requestParameters, id)))
      )
      .catch(() => dispatch({ type: actionTypes.FAIL }))
  }

  return {

    fetchAllThunk,

    fetchOne,

    fetchAll: (forceReload, ...requestParameters) => ({
      forceReload,
      types: receiveActionTypes,
      cacheKey: `fetch-all-${entityType}-${requestParameters.join('-')}`,
      callApi: () => api.fetchAll(...requestParameters)
    }),

    create: (...requestParameters) => ({
      types: receiveActionTypes,
      callApi: () => api.create(...requestParameters)
    }),

    update: (...requestParameters) => ({
      types: receiveActionTypes,
      callApi: () => api.update(...requestParameters)
    }),

    remove: (...requestParameters) => ({
      types: removeActionTypes,
      callApi: () => api.remove(...requestParameters)
    })

  }
}
