import { Map } from 'immutable'

jest.unmock('../reducers');
import * as reducers from '../reducers';

describe('Fetching Module', () => {

  it('should handle set', () => {
    const initialState = Map({});
    const action = { payload: { 123: { a: 'b' } } };
    const newState = reducers.set(initialState, action).toJS();
    expect(newState).toEqual({ 123: { a: 'b' } });
  });

  it('should handle clear', () => {
    const initialState = Map({ 123: { a: 'b' } });
    const action = { payload: { 123: { a: 'b' } } };
    const newState = reducers.clear(initialState, action);
    expect(newState).toEqual(Map());
  });
})
