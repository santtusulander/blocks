const Immutable = require('immutable');

jest.dontMock('../group.js')

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
} = require('../group.js');

describe('Group Module', () => {

  it('should handle create group success', () => {
    const state = Immutable.fromJS({
      allGroups: []
    });
    const newState = createSuccess(state, {payload: {id: 1}});
    const expectedState = Immutable.fromJS({
      allGroups: [1],
      activeGroup: {id: 1}
    })
    expect(Immutable.is(newState, expectedState)).toBeTruthy();
  });

  it('should handle delete group success', () => {
    const state = Immutable.fromJS({
      allGroups: [1]
    });
    const newState = deleteSuccess(state, {payload: {id: 1}});
    expect(newState.get('allGroups')).not.toContain(1);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle delete group failure', () => {
    const state = Immutable.fromJS({
      allGroups: [1]
    });
    const newState = deleteFailure(state, {payload: {id: 1}});
    expect(newState.get('allGroups')).toContain(1);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch group success', () => {
    const state = Immutable.fromJS({
      activeGroup: {id: 1}
    });
    const newState = fetchSuccess(state, {payload: {id: 2}});
    expect(newState.get('activeGroup').get('id')).toBe(2);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch group failure', () => {
    const state = Immutable.fromJS({
      activeGroup: {id: 1}
    });
    const newState = fetchFailure(state, {payload: {id: 2}});
    expect(newState.get('activeGroup')).toBe(null);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch all success', () => {
    const state = Immutable.fromJS({
      allGroups: [1]
    });
    const newState = fetchAllSuccess(state, {payload: {data: [2]}});
    expect(newState.get('allGroups').get(0)).toBe(2);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch all failure', () => {
    const state = Immutable.fromJS({
      allGroups: [1]
    });
    const newState = fetchAllFailure(state, {payload: {data: [2]}});
    expect(newState.get('allGroups').size).toBe(0);
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
      activeGroup: 'something'
    });
    const newState = updateSuccess(state);
    expect(newState.get('activeGroup')).toBe(null);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle update failure', () => {
    const state = Immutable.fromJS({
      activeGroup: 'something'
    });
    const newState = updateFailure(state);
    expect(newState.get('activeGroup')).toBe('something');
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle changing active group', () => {
    const state = Immutable.fromJS({
      activeGroup: 'something'
    });
    const newState = changeActive(state, {payload: 'something else'});
    expect(newState.get('activeGroup')).toBe('something else');
  });

});
