import {Map, fromJS} from 'immutable'
jest.unmock('../reducers');
import {receiveEntity, failEntity} from '../reducers.js';

describe('Entity Module', () => {

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
      response: {
        entities: {
          properties: normalizedPayload
        }
      }
    };

    const newState = receiveEntity('properties')(initialState, action);

    expect(newState).toEqual(fromJS(normalizedPayload));
  });

  it('should handle fail', () => {
    const initialState = new Map({aaa: 'bbb'})

    const newState = failEntity(initialState);
    expect(newState).toEqual(initialState);
  });
})
