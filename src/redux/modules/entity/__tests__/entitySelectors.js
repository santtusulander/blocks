jest.unmock('../selectors')

import {
  getEntityById,
  getEntitiesByParent,
  } from '../selectors'

describe('Entity Selectors', () => {
  it('should handle getEntityById', () => {
    const state = {
      1: {id: 1, name: 'entity 1'},
      2: {id: 2, name: 'entity 2'},
      3: {id: 3, name: 'entity 3'}
    }

    const groupState = {
      11: [1,3],
      22: [1],
      33: [1,2,3]
    }

    const selected = getEntityById(2, state);
    expect(selected.name).toEqual('entity 2')
  })

  it('should handle getEntitiesByParent', () => {
    const state = {
      1: {id: 1, name: 'entity 1'},
      2: {id: 2, name: 'entity 2'},
      3: {id: 3, name: 'entity 3'}
    }

    const groupState = {
      11: [1,3],
      22: [1],
      33: [1,2,3]
    }

    const selected = getEntitiesByParent( 11, state, groupState)

    expect(selected.length).toEqual(2)
    expect(selected[1].name).toEqual('entity 3')
  })
});
