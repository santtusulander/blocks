jest.unmock('../host.js')
jest.unmock('immutable')
jest.unmock('../../../util/helpers.js')

import { Map, fromJS, is } from 'immutable'

import {
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
} from '../host.js'

describe('Host Module', () => {
  it('should handle create host success', () => {
    const state = fromJS({
      configuredHostNames: [],
      allHosts: []
    });
    const payload = fromJS({
      id: 1,
      services: [
        {
          deployment_mode: 'trial',
          configurations: [{
            config_id: 1,
            edge_configuration: { trial_name: 'aa' },
            defaults: {},
            request_policy: {policy_rules:[]},
            response_policy: {policy_rules:[]}
          }],
          active_configurations: [{ config_id: 1 }]
        }
      ]
    })
    const newState = createSuccess(state, {payload});
    const expectedState = fromJS({
      allHosts: [1],
      activeHost: payload,
      activeHostConfiguredName: 'aa',
      configuredHostNames: ['aa']
    })
    expect(is(newState, expectedState)).toBeTruthy();
  });

  it('should handle delete host success', () => {
    const state = fromJS({
      allHosts: [{published_host_id: 1}],
      configuredHostNames: [1]
    });
    const newState = deleteSuccess(state, {payload: Map({published_host_id: 1})});
    expect(newState.get('allHosts').toJS()).not.toContain([{published_host_id: 1}]);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle delete host failure', () => {
    const state = fromJS({
      allHosts: [1]
    });
    const newState = deleteFailure(state, {payload: {id: 1}});
    expect(newState.get('allHosts').toJS()).toContain(1);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch host success', () => {
    const state = fromJS({
      activeHost: null
    });
    const payload = { payload: { services: [{ configurations: [{ config_id: 1 }], active_configurations: [{ config_id: 1 }] }] } }
    const newState = fetchSuccess(state, payload);
    const expectedState = fromJS({
      activeHost: {
        services: [
          {
            configurations: [{
              config_id: 1,
              defaults: {},
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
    expect(is(expectedState, newState)).toBeTruthy();
  });

  it('should handle fetch host failure', () => {
    const state = fromJS({
      activeHost: {id: 1}
    });
    const newState = fetchFailure(state, {payload: {id: 2}});
    expect(newState.get('activeHost')).toBe(null);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch all success', () => {
    const state = fromJS({
      allHosts: [1]
    });
    const newState = fetchAllSuccess(state, {payload: [2]});
    expect(newState.get('allHosts').get(0)).toBe(2);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch all failure', () => {
    const state = fromJS({
      allHosts: [1]
    });
    const newState = fetchAllFailure(state);
    expect(newState.get('allHosts').size).toBe(0);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle starting to fetch', () => {
    const state = fromJS({
      fetching: false
    });
    const newState = startFetch(state);
    expect(newState.get('fetching')).toBeTruthy();
  });

  it('should handle update success', () => {
    const state = fromJS({
      activeHost: {id: 1}
    });
    const newState = updateSuccess(state, {payload: {id: 2}});
    expect(newState.get('activeHost').get('id')).toBe(2);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle update failure', () => {
    const state = fromJS({
      activeHost: 'something'
    });
    const newState = updateFailure(state);
    expect(newState.get('activeHost')).toBe('something');
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle changing active host', () => {
    const state = fromJS({
      activeHost: 'something'
    });
    const newState = changeActive(state, {payload: 'something else'});
    expect(newState.get('activeHost')).toBe('something else');
  });

});
