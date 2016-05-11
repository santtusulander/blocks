const Immutable = require('immutable');

jest.dontMock('../reports.js')

const {
  fetchUrlMetricsSuccess,
  fetchUrlMetricsFailure,
  fetchFileErrorMetricsSuccess,
  fetchFileErrorMetricsFailure,
  startFetch,
  finishFetch
} = require('../reports.js');

describe('Account Module', () => {

  it('should handle fetch url metrics success', () => {
    const state = Immutable.fromJS({
      urlMetrics: [1]
    });
    const newState = fetchUrlMetricsSuccess(state, {payload: [2]});
    expect(newState.get('urlMetrics').get(0)).toBe(2);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch url metrics failure', () => {
    const state = Immutable.fromJS({
      urlMetrics: [1]
    });
    const newState = fetchUrlMetricsFailure(state, {payload: [2]});
    expect(newState.get('urlMetrics').size).toBe(0);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch file error metrics success', () => {
    const state = Immutable.fromJS({
      fileErrorSummary: {fake: false},
      fileErrorURLs: [1]
    });
    const newState = fetchFileErrorMetricsSuccess(state, {
      payload: {
        data: {
          num_errors: {fake: true},
          url_details: [2]
        }
      }
    });
    expect(newState.get('fileErrorSummary').get('fake')).toBeTruthy();
    expect(newState.get('fileErrorURLs').get(0)).toBe(2);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch file error metrics failure', () => {
    const state = Immutable.fromJS({
      fileErrorSummary: {fake: false},
      fileErrorURLs: [1]
    });
    const newState = fetchFileErrorMetricsFailure(state, {
      payload: {
        data: {
          num_errors: {fake: true},
          url_details: [2]
        }
      }
    });
    expect(newState.get('fileErrorSummary').size).toBe(0);
    expect(newState.get('fileErrorURLs').size).toBe(0);
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
