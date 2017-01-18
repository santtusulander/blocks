/*eslint consistent-return: 0*/

const CACHE_EXPIRATION_TIME = 300000

/**
 *
 * @param {function} dispatch
 * @param {function} getState
 * @returns {Promise}
 */
export default function apiMiddleware({ dispatch, getState }) {
  return next => action => {
    const {
      types,
      callApi,
      cacheKey,
      forceReload,
      payload = {}
    } = action;

    if (!types) {
      // Normal action: pass it on
      return next(action);
    }

    if (!Array.isArray(types) || types.length !== 3 || !types.every(type => typeof type === 'string')) {
      throw new Error('Expected an array of three string types.');
    }

    if (typeof callApi !== 'function') {
      throw new Error('Expected `callApi` to be a function.');
    }

    if (!forceReload && getState().cache[cacheKey] > CACHE_EXPIRATION_TIME) {
      return;
    }

    if (cacheKey) {
      dispatch({ type: 'CACHE_REQUEST', payload: { [cacheKey]: Math.floor(Date.now() / 1000) } })
    }

    const [ requestType, successType, failureType ] = types;

    dispatch({ ...payload, type: requestType });
    return callApi().then(
      response => dispatch({ ...payload, response, type: successType }),
      error => dispatch({ ...payload, error, type: failureType })
    );
  };
}
