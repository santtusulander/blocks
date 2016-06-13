jest.unmock('../user.js')

import {
  userLoggedInSuccess,
  userLoggedInFailure,
  userLoggedOutSuccess,
  userStartFetch,
  userTokenChecked
} from '../user.js'

import Immutable from 'immutable'

describe('User Module', () => {
    const state = Immutable.Map();

    it('should handle userLoggedInSuccess', () => {
      const newState = userLoggedInSuccess(state, { payload: {username: 'Username' } })

      const expectedState = Immutable.fromJS({
        loggedIn: true,
        fetching: false,
        username: 'Username'
      })

      expect( Immutable.is(newState, expectedState)).toBeTruthy()

    })

    it('should handle userLoggedInFailure', () => {
      const newState = userLoggedInFailure(state, { payload: {username: 'Username' } })
      const expectedState = Immutable.fromJS({
        loggedIn: false,
        fetching: false
      })

      expect( Immutable.is(newState, expectedState)).toBeTruthy()

    })

    it('should handle userLoggedOutSuccess', () => {
      const newState = userLoggedOutSuccess(state, { payload: {username: 'Username' } })

      expect( newState.get('loggedIn')).toBe(false)

    })

    it('should handle userStartFetch', () => {
      const newState = userStartFetch(state )

      expect( newState.get('fetching')).toBe(true)

    })

    it('should handle userTokenChecked -- with payload', () => {
      const newState = userTokenChecked(state, {payload: {token: 'foorbar', username: 'Username'} } )
      const expectedState = Immutable.fromJS({
        loggedIn: true,
        username: 'Username'

      })

      expect( Immutable.is(newState, expectedState) ).toBeTruthy()

    })

    it('should handle userTokenChecked -- without payload', () => {
      const newState = userTokenChecked(state, {payload: null } )

      expect( newState.get('loggedIn')).toBe(false)
    })
})
