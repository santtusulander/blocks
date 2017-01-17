/*eslint consistent-return: 0*/
import moment from 'moment'


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
      payload = {}
    } = action;
    const cachedRequest = getState().cache[cacheKey]
    const now = moment()

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

    if (cachedRequest && cachedRequest > now.subtract(5, 'minutes').unix()) {
      return;
    }

    if (cacheKey) {
      dispatch({ type: 'CACHE_REQUEST', payload: { [cacheKey]: now.unix() } })
    }

    const [ requestType, successType, failureType ] = types;

    dispatch({ ...payload, type: requestType });
    debugger
    return callApi().then(
      response => {
        console.log(response);
        return dispatch({ ...payload, response, type: successType })
      },
      error => dispatch({ ...payload, error, type: failureType })
    );
  };
}
