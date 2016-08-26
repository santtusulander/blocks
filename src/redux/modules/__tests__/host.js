const Immutable = require('immutable');

jest.dontMock('../host.js')

const {
  createSuccess,
  deleteSuccess,
  deleteFailure,
  fetchSuccess,
  fetchFailure,
  fetchAllSuccess,
  fetchAllFailure,
  startFetch,
  updateSuccess,
  updateFailure,
  changeActive
} = require('../host.js');

describe('Host Module', () => {
  it('should handle create host success', () => {
    const state = Immutable.fromJS({
      allHosts: []
    });
    const payload = Immutable.fromJS(
      {
        id: 1
      }
    );
    const newState = createSuccess(state, {payload});
    const expectedState = Immutable.fromJS({
      allHosts: [1],
      activeHost: {id: 1},
      activeHostConfiguredName: null
    })
    expect(Immutable.is(newState, expectedState)).toBeTruthy();
  });

  it('should handle delete host success', () => {
    const state = Immutable.fromJS({
      allHosts: [1]
    });
    const newState = deleteSuccess(state, {payload: {id: 1}});
    expect(newState.get('allHosts')).not.toContain(1);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle delete host failure', () => {
    const state = Immutable.fromJS({
      allHosts: [1]
    });
    const newState = deleteFailure(state, {payload: {id: 1}});
    expect(newState.get('allHosts')).toContain(1);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch host success', () => {
    const state = Immutable.fromJS({
      activeHost: null
    });
    const payload = { payload: { services: [{ configurations: [{ config_id: 1 }], active_configurations: [{ config_id: 1 }] }] } }
    const newState = fetchSuccess(state, payload);
    const expectedState = Immutable.fromJS({
      activeHost: {
        services: [
          {
            configurations: [{
              config_id: 1,
              default_policy: {policy_rules:[]},
              request_policy: {policy_rules:[]},
              response_policy: {policy_rules:[]}
            }],
            active_configurations: [{ config_id: 1 }]
          }
        ]
      },
      fetching: false,
      activeHostConfiguredName: null
    })
    expect(Immutable.is(expectedState, newState)).toBeTruthy();
  });

  it('should handle fetch host failure', () => {
    const state = Immutable.fromJS({
      activeHost: {id: 1}
    });
    const newState = fetchFailure(state, {payload: {id: 2}});
    expect(newState.get('activeHost')).toBe(null);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch all success', () => {
    const state = Immutable.fromJS({
      allHosts: [1]
    });
    const newState = fetchAllSuccess(state, {payload: [2]});
    expect(newState.get('allHosts').get(0)).toBe(2);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch all failure', () => {
    const state = Immutable.fromJS({
      allHosts: [1]
    });
    const newState = fetchAllFailure(state);
    expect(newState.get('allHosts').size).toBe(0);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle starting to fetch', () => {
    const state = Immutable.fromJS({
      fetching: false
    });
    const newState = startFetch(state);
    expect(newState.get('fetching')).toBeTruthy();
  });

  it('should handle update success', () => {
    const state = Immutable.fromJS({
      activeHost: {id: 1}
    });
    const newState = updateSuccess(state, {payload: {id: 2}});
    expect(newState.get('activeHost').get('id')).toBe(2);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle update failure', () => {
    const state = Immutable.fromJS({
      activeHost: 'something'
    });
    const newState = updateFailure(state);
    expect(newState.get('activeHost')).toBe('something');
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle changing active host', () => {
    const state = Immutable.fromJS({
      activeHost: 'something'
    });
    const newState = changeActive(state, {payload: 'something else'});
    expect(newState.get('activeHost')).toBe('something else');
  });

});
