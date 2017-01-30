import {fromJS} from 'immutable'

jest.unmock('../selectors')

import {
  getEntityById,
  getEntitiesByParent,
  } from '../selectors'

describe('Entity Selectors', () => {
  it('should handle getEntityById', () => {
    const testData = fromJS(
      {
        1: {id: 1, name: 'entity 1'},
        2: {id: 2, name: 'entity 2'},
        3: {id: 3, name: 'entity 3'}
      }
    )

    const state =
    {
      entities: {
        test: testData
      }
    }

    const selected = getEntityById(state, 'test', 2);

    expect( selected.get('name') ).toEqual('entity 2')
  })

  it('should handle getEntitiesByParent', () => {
    const testData = fromJS(
      {
        1: {id: 1, name: 'entity 1', parentId: 1},
        2: {id: 2, name: 'entity 2', parentId: 1},
        3: {id: 3, name: 'entity 3', parentId: 2}
      }
    )

    const state =
    {
      entities: {
        test: testData
      }
    }

    const selected = getEntitiesByParent(state, 'test', 1).toJS()

    expect(selected.length).toEqual(2)
    expect(selected[0].name).toEqual('entity 1')
    expect(selected[1].name).toEqual('entity 2')
  })
});
