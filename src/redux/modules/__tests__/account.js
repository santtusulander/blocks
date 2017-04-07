import Immutable from 'immutable'

jest.unmock('../account.js')

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
} from '../account.js'

describe('Account Module', () => {

  it('should handle create account success', () => {
    const state = Immutable.fromJS({
      allAccounts: []
    });
    const newState = createSuccess(state, {payload: {id: 1, name: 'aaa'}});
    const expectedState = Immutable.fromJS({
      allAccounts: [{id: 1, name: 'aaa'}],
      activeAccount: null,
      changedAccount: { id: 1, name: 'aaa', action: 'add' }
    })
    expect(Immutable.is(newState, expectedState)).toBeTruthy();
  });

  it('should handle delete account success', () => {
    const state = Immutable.fromJS({
      allAccounts: [{id: 1}]
    });
    const newState = deleteSuccess(state, {payload: {id: 1}});
    expect(newState.get('allAccounts').toJS()).not.toContain(1);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle delete account failure', () => {
    const state = Immutable.fromJS({
      allAccounts: [1]
    });
    const newState = deleteFailure(state, {payload: {id: 1}});
    expect(newState.get('allAccounts').toJS()).toContain(1);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch account success', () => {
    const state = Immutable.fromJS({
      activeAccount: {id: 1}
    });
    const newState = fetchSuccess(state, {payload: {id: 2}});
    expect(newState.get('activeAccount').get('id')).toBe(2);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch account failure', () => {
    const state = Immutable.fromJS({
      activeAccount: {id: 1}
    });
    const newState = fetchFailure(state, {payload: {id: 2}});
    expect(newState.get('activeAccount')).toBe(null);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch all success', () => {
    const state = Immutable.fromJS({
      allAccounts: [1]
    });
    const newState = fetchAllSuccess(state, {payload: {data: [2]}});
    expect(newState.get('allAccounts').get(0)).toBe(2);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch all failure', () => {
    const state = Immutable.fromJS({
      allAccounts: [1]
    });
    const newState = fetchAllFailure(state, {payload: {data: [2]}});
    expect(newState.get('allAccounts').size).toBe(0);
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
      activeAccount: {id: 1, name: 'aaa'},
      allAccounts: [{id: 1, name: 'aaa'}]
    });
    const newState = updateSuccess(state, {payload: {id: 1, name: 'bbb'}});
    expect(newState.get('activeAccount').get('name')).toBe('bbb');
    expect(newState.get('allAccounts').get(0).get('name')).toBe('bbb');
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle update failure', () => {
    const state = Immutable.fromJS({
      activeAccount: 'something'
    });
    const newState = updateFailure(state);
    expect(newState.get('activeAccount')).toBe('something');
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle changing active account', () => {
    const state = Immutable.fromJS({
      activeAccount: 'something'
    });
    const newState = changeActive(state, {payload: 'something else'});
    expect(newState.get('activeAccount')).toBe('something else');
  });

});
