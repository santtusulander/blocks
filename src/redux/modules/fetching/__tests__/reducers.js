jest.unmock('../reducers');
import * as reducers from '../reducers';

describe('Fetching Module', () => {

  it('should handle set', () => {
    const initialState = false;
    const newState = reducers.set(initialState);
    expect(newState).toEqual(true);
  });

  it('should handle clear', () => {
    const initialState = true;

    const newState = reducers.clear(initialState);
    expect(newState).toEqual(false);
  });
})
