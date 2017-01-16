import {Map, fromJS} from 'immutable'
jest.unmock('../reducers');
import * as reducers from '../reducers';

describe('Properties Module', () => {

  it('should handle receive', () => {
    const initialState = new Map()
    const normalizedPayload = {
      'aaa': {
        published_host_id: "aaa"
      },
      'bbb': {
        published_host_id: "bbb"
      },
    };

    const action = {
      payload: {
        entities: {
          properties: normalizedPayload
        }
      }
    };

    const newState = reducers.receive(initialState, action);
    expect(newState).toEqual(fromJS(normalizedPayload));
  });

  it('should handle fail', () => {
    const initialState = new Map({aaa: 'bbb'})

    const newState = reducers.fail(initialState);
    expect(newState).toEqual(initialState);
  });
})
