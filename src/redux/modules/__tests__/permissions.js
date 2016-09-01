jest.unmock('../permissions.js')

import {
  permissionsFetchSuccess,
  permissionsFetchFailure
} from '../permissions.js'

import Immutable from 'immutable'

describe('Permissions Module', () => {
    it('should handle permissionsFetchSuccess', () => {
      const oldState = Immutable.fromJS({})
      const newState = permissionsFetchSuccess(oldState, { payload: {aaa: [1,2] } })
      const expectedState = Immutable.fromJS({
        aaa: [1,2]
      })
      expect( Immutable.is(newState, expectedState)).toBeTruthy()
    })

    it('should handle permissionsFetchFailure', () => {
      const oldState = Immutable.fromJS({
        aaa: [1,2]
      })
      const newState = permissionsFetchFailure(oldState)
      const expectedState = Immutable.fromJS({})
      expect( Immutable.is(newState, expectedState)).toBeTruthy()
    })
})
