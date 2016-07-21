jest.unmock('../permissions.js')

import {
  permissionsFetchSuccess,
  permissionsFetchFailure
} from '../permissions.js'

import Immutable from 'immutable'

describe('Permissions Module', () => {
    it('should handle permissionsFetchSuccess', () => {
      const oldState = Immutable.fromJS({
        permissions: []
      })
      const newState = permissionsFetchSuccess(oldState, { payload: {data: [1,2] } })
      const expectedState = Immutable.fromJS({
        permissions: [1,2]
      })
      expect( Immutable.is(newState, expectedState)).toBeTruthy()
    })

    it('should handle permissionsFetchFailure', () => {
      const oldState = Immutable.fromJS({
        permissions: [1,2]
      })
      const newState = permissionsFetchFailure(oldState)
      const expectedState = Immutable.fromJS({
        permissions: []
      })
      expect( Immutable.is(newState, expectedState)).toBeTruthy()
    })
})
