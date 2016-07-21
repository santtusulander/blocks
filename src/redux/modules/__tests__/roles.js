jest.unmock('../roles.js')

import {
  rolesFetchSuccess,
  rolesFetchFailure
} from '../roles.js'

import Immutable from 'immutable'

describe('Roles Module', () => {
    it('should handle rolesFetchSuccess', () => {
      const oldState = Immutable.fromJS({
        roles: []
      })
      const newState = rolesFetchSuccess(oldState, { payload: {data: [1,2] } })
      const expectedState = Immutable.fromJS({
        roles: [1,2]
      })
      expect( Immutable.is(newState, expectedState)).toBeTruthy()
    })

    it('should handle rolesFetchFailure', () => {
      const oldState = Immutable.fromJS({
        roles: [1,2]
      })
      const newState = rolesFetchFailure(oldState)
      const expectedState = Immutable.fromJS({
        roles: []
      })
      expect( Immutable.is(newState, expectedState)).toBeTruthy()
    })
})
