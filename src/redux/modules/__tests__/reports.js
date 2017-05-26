import Immutable from 'immutable'

jest.unmock('../reports.js')

import {
  fetchUrlMetricsSuccess,
  fetchUrlMetricsFailure,
  fetchFileErrorMetricsSuccess,
  fetchFileErrorMetricsFailure,
  startFetch,
  finishFetch
} from '../reports.js'

describe('Reports Module', () => {

  it('should handle fetch url metrics success', () => {
    const state = Immutable.fromJS({
      urlMetrics: [1]
    });
    const newState = fetchUrlMetricsSuccess(state, {payload: {data: [2]}});
    expect(newState.get('urlMetrics').get(0)).toBe(2);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch url metrics failure', () => {
    const state = Immutable.fromJS({
      urlMetrics: [1]
    });
    const newState = fetchUrlMetricsFailure(state, {payload: {data: [2]}});
    expect(newState.get('urlMetrics').size).toBe(0);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle starting to fetch', () => {
    const state = Immutable.fromJS({
      fetching: false
    });
    const newState = startFetch(state);
    expect(newState.get('fetching')).toBeTruthy();
  });

  it('should handle finishing fetch', () => {
    const state = Immutable.fromJS({
      fetching: true
    });
    const newState = finishFetch(state);
    expect(newState.get('fetching')).toBeFalsy();
  });

});
