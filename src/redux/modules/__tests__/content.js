import Immutable from 'immutable'

jest.unmock('../content.js')

import {
  emptyContent,
  fetchSuccess,
  fetchFailed,
  startFetch
} from '../content.js'

describe('Content Module', () => {

  it('should handle fetch content success', () => {
    const state = Immutable.fromJS({
      accounts: [],
      groups: [],
      properties: []
    });
    const newState = fetchSuccess(state, {payload: {
      accounts: [{"account_id": 1, "name": "Disney"}],
      groups: [{"account_id": 1, "name": "Disney"}],
      properties: [{"account_id": 1, "name": "Disney"}]
    }});

    expect(newState.get('accounts').size).toBe(1)
    expect(newState.get('groups').size).toBe(1)
    expect(newState.get('properties').size).toBe(1)
    expect(newState.get('fetching')).toBeFalsy()
  });

  it('should handle fetch content failure', () => {
    const newState = fetchFailed()
    const expectedState = emptyContent
    expect(Immutable.is(newState, expectedState)).toBeTruthy()

  });

  it('should handle starting to fetch', () => {
    const state = Immutable.Map()
    const newState = startFetch(state);
    expect(newState.get('fetching')).toBeTruthy();
  });
});
