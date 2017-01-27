jest.unmock('../reducers');
import * as reducers from '../reducers';

describe('Fetching Module', () => {

  it('should handle set', () => {
    const initialState = false;
    const newState = reducers.set(initialState);
    expect(newState).toEqual(1);
  });

  it('should handle set (incerement)', () => {
    const initialState = false;
    const state1 = reducers.set(initialState);
    const newState = reducers.set(state1);
    expect(newState).toEqual(2);
  });

  it('should handle clear (decrement)', () => {
    const initialState = 2;

    const newState = reducers.clear(initialState);
    expect(newState).toEqual(1);
  });
})
