import { fromJS } from 'immutable'

jest.unmock('../topo.js')

import {
  countriesFetchSuccess,
  countriesFetchFailure,
  statesFetchSuccess,
  statesFetchFailure,
  citiesFetchSuccess,
  citiesFetchFailure,
  activeCountryChanged,
  activeStateChanged,
  fetchStarted
} from '../topo.js'

describe('Topology Module', () => {
  let state = null;
  beforeEach(() => {
    state = fromJS({
      countries: { aaa: 'bbb' },
      cities: { bar: 'foo' },
      states: { bbb: 'ccc' },
      activeState: null,
      activeCountry: null
    })
  })
  it('should handle fetch countries success', () => {
    const newState = countriesFetchSuccess(state, {payload: { foo: 'bar' }});
    expect(newState.get('countries').get('foo')).toBe('bar');
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch countries failure', () => {
    const newState = countriesFetchFailure(state);
    expect(newState.get('countries').size).toBe(0);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch states success', () => {
    const newState = statesFetchSuccess(state, {payload: { foo: 'bar' }});
    expect(newState.get('states').get('foo')).toBe('bar');
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch states failure', () => {
    const newState = statesFetchFailure(state);
    expect(newState.get('states').size).toBe(0);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch cities success', () => {
    const newState = citiesFetchSuccess(state, {payload: { foo: 'bar' }});
    expect(newState.get('cities').get('foo')).toBe('bar');
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle fetch cities failure', () => {
    const newState = citiesFetchFailure(state);
    expect(newState.get('cities').size).toBe(0);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should handle changing active country', () => {
    const newState = activeCountryChanged(state, {payload: 'foo'});
    expect(newState.get('activeCountry')).toBe('foo');
    expect(newState.get('activeState')).toBe(null);
    expect(newState.get('cities').size).toBe(0);
    expect(newState.get('states').size).toBe(0);
  });

  it('should handle changing active state', () => {
    const newState = activeStateChanged(state, {payload: 'foo'});
    expect(newState.get('activeState')).toBe('foo');
    expect(newState.get('cities').size).toBe(0);
  });

  it('should handle start fetching', () => {
    const newState = fetchStarted(state);
    expect(newState.get('fetching')).toBeTruthy();
  });
});
