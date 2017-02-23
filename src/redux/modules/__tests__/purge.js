const Immutable = require('immutable');

jest.unmock('../purge.js')

import {
  createRequestSuccess,
  createFailure,
  fetchSuccess,
  fetchFailure,
  fetchListSuccess,
  fetchListFailure,
  fetchObjectsSuccess,
  fetchObjectsFailure,
  startFetch,
  updateActive,
  resetActive,
  emptyPurges,
  emptyPurge
} from '../purge.js'

describe('Purge Module', () => {

  it('should handle create request with error response', () => {
    const state = Immutable.fromJS({ fetching: true })
    const newState = createRequestSuccess(state, {payload: new Error()});
    expect(newState.get('activePurge')).toBeUndefined();
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle create purge success', () => {
    const state = emptyPurges
    const newState = createRequestSuccess(state, {payload: { foo: 'bar' }});
    expect(newState.get('activePurge').has('foo')).toBeTruthy();
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle create purge failure', () => {
    const state = Immutable.fromJS({ fetching: true });
    const newState = createFailure(state);
    expect(newState.get('activePurge')).toBe(null);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch purge success', () => {
    const state = Immutable.fromJS({ fetching: true });
    const newState = fetchSuccess(state, {payload: {foo: 'bar'}});
    expect(newState.get('activePurge').has('foo')).toBeTruthy();
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch purge failure', () => {
    const state = Immutable.fromJS({ fetching: true });
    const newState = fetchFailure(state);
    expect(newState.get('activePurge')).toBe(null);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch list success', () => {
    const state = Immutable.fromJS({ fetching: true });
    const newState = fetchListSuccess(state, {payload: [1, 2, 3]});
    expect(newState.get('purgeList').size).toBe(3);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch list failure', () => {
    const state = Immutable.fromJS({ fetching: true });
    const newState = fetchListFailure(state);
    expect(newState.get('purgeList').size).toBe(0);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch objects success', () => {
    const state = Immutable.fromJS({ fetching: true });
    const newState = fetchObjectsSuccess(state, {payload: {data: [1, 2, 3]}});
    expect(newState.get('purgeObjects').size).toBe(3);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch objects failure', () => {
    const state = Immutable.fromJS({ fetching: true });
    const newState = fetchObjectsFailure(state);
    expect(newState.get('purgeObjects').size).toBe(0);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle starting to fetch', () => {
    const state = Immutable.fromJS({ fetching: true });
    const newState = startFetch(state);
    expect(newState.get('fetching')).toBeTruthy();
  });

  it('should handle reset active', () => {
    const state = Immutable.Map({ activePurge : null });
    const newState = resetActive(state);
    expect(Immutable.is(newState.get('activePurge'), emptyPurge)).toBeTruthy();
  });

  it('should handle update active', () => {
    const state = Immutable.fromJS({
      activePurge: 'something'
    });
    const newState = updateActive(state, {payload: {foo: 'bar'}});
    expect(newState.get('activePurge').foo).toBe('bar');
  });

});
