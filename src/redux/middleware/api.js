/*eslint consistent-return: 0*/
import { CACHE_REQUEST, CACHE_REQUEST_CLEAR } from '../modules/cache'

const CACHE_EXPIRATION_TIME = 300000

const cacheIsValid = requestDate => {
  return ((Date.now() - requestDate) < CACHE_EXPIRATION_TIME)
}

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

    if (!forceReload && cacheIsValid(getState().cache[cacheKey])) {
      return Promise.resolve();
    }

    if (!forceReload && cacheKey) {
      dispatch({ type: CACHE_REQUEST, payload: { [cacheKey]: Date.now() } })
    }

    const [ requestType, successType, failureType ] = types;

    dispatch({ payload, type: requestType });

    return callApi().then(
      response => dispatch({ payload, response, type: successType }),
      error => {
        if (!forceReload && cacheKey) {
          dispatch({ type: CACHE_REQUEST_CLEAR, payload: cacheKey })
        }
        return dispatch({ payload, error, type: failureType })
      }
    );
  };
}
