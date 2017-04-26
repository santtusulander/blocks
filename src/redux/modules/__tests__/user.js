jest.unmock('../user.js')

import {
  userLoggedInSuccess,
  userLoggedInFailure,
  userLoggedOutSuccess,
  userStartFetch,
  userFinishFetch,
  userTokenChecked,
  fetchSuccess,
  fetchFailure,
  fetchAllSuccess,
  fetchAllFailure,
  deleteUserSuccess,
  deleteUserFailure,
  createUserSuccess,
  createUserFailure,
  userNameSave
} from '../user.js'

import Immutable from 'immutable'

describe('User Module', () => {
    const state = Immutable.Map();

    it('should handle userLoggedInSuccess with code 200', () => {
      const newState = userLoggedInSuccess(state, { payload: {username: 'Username', status: 200 } })

      const expectedState = Immutable.fromJS({
        loggedIn: true
      })

      expect( Immutable.is(newState, expectedState)).toBeTruthy()

    })

    it('should handle userLoggedInSuccess with code 202', () => {
      const newState = userLoggedInSuccess(state, { payload: {username: 'Username', status: 202 } })

      const expectedState = Immutable.fromJS({
        loggedIn: false,
        fetching: false
      })

      expect( Immutable.is(newState, expectedState)).toBeTruthy()

    })

    it('should handle userLoggedInFailure', () => {
      const newState = userLoggedInFailure(state, { payload: {username: 'Username' } })

      expect( newState.get('loggedIn')).toBe(false)
      expect( newState.get('currentUser').size).toBe(0)

    })

    it('should handle userLoggedOutSuccess', () => {
      const newState = userLoggedOutSuccess(state, { payload: {username: 'Username' } })

      expect( newState.get('loggedIn')).toBe(false)

    })

    it('should handle userStartFetch', () => {
      const newState = userStartFetch(state )
      expect( newState.get('fetching')).toBe(true)
    })

    it('should handle userFinishFetch', () => {
      const newState = userFinishFetch(state )
      expect( newState.get('fetching')).toBe(false)
    })

    it('should handle userTokenChecked -- with payload', () => {
      const newState = userTokenChecked(state, {payload: {currentUserPermissions: {}, token: 'foorbar'} } )
      const expectedState = Immutable.fromJS({
        loggedIn: true,
        currentUserPermissions: {}
      })

      expect( Immutable.is(newState, expectedState) ).toBeTruthy()

    })

    it('should handle userTokenChecked -- without payload', () => {
      const newState = userTokenChecked(state, {payload: null } )

      expect( newState.get('loggedIn')).toBe(false)
    })

    it('should handle fetchSuccess', () => {
      const newState = fetchSuccess(state, { payload: {username: 'Username' } })
      const expectedState = Immutable.fromJS({
        currentUser: {username: 'Username'},
        fetching: false
      })
      expect( Immutable.is(newState, expectedState)).toBeTruthy()
    })

    it('should handle fetchFailure', () => {
      const newState = fetchFailure(state)
      const expectedState = Immutable.fromJS({
        currentUser: {},
        fetching: false
      })
      expect( Immutable.is(newState, expectedState)).toBeTruthy()
    })

    it('should handle fetchAllSuccess', () => {
      const newState = fetchAllSuccess(state, { payload: [1] })
      const expectedState = Immutable.fromJS({
        allUsers: [1],
        fetching: false
      })
      expect( Immutable.is(newState, expectedState)).toBeTruthy()
    })

    it('should handle fetchAllFailure', () => {
      const newState = fetchAllFailure(state)
      const expectedState = Immutable.fromJS({
        allUsers: [],
        fetching: false
      })
      expect( Immutable.is(newState, expectedState)).toBeTruthy()
    })

    it('should handle deleteUserSuccess', () => {
      const initialState = Immutable.fromJS({
        allUsers: [
          {email: 'abc'},
          {email: 'def'}
        ],
        fetching: false
      })
      const newState = deleteUserSuccess(initialState, { payload: 'abc' })
      const expectedState = Immutable.fromJS({
        allUsers: [
          {email: 'def'}
        ],
        fetching: false
      })
      expect( Immutable.is(newState, expectedState)).toBeTruthy()
    })

    it('should handle deleteUserFailure', () => {
      const initialState = Immutable.fromJS({
        allUsers: [
          {email: 'abc'},
          {email: 'def'}
        ],
        fetching: false
      })
      const newState = deleteUserFailure(initialState)
      expect( Immutable.is(newState, initialState)).toBeTruthy()
    })

    it('should handle createUserSuccess', () => {
      const initialState = Immutable.fromJS({
        allUsers: [
          {email: 'abc'}
        ],
        fetching: false
      })
      const newState = createUserSuccess(initialState, { payload: {email: 'def'} })
      const expectedState = Immutable.fromJS({
        allUsers: [
          {email: 'abc'},
          {email: 'def'}
        ],
        fetching: false
      })
      expect( Immutable.is(newState, expectedState)).toBeTruthy()
    })

    it('should handle createUserFailure', () => {
      const initialState = Immutable.fromJS({
        allUsers: [
          {email: 'abc'}
        ],
        fetching: false
      })
      const newState = createUserFailure(initialState)
      expect( Immutable.is(newState, initialState)).toBeTruthy()
    })

    it('should handle userNameSave', () => {
      const newState = userNameSave(state, {payload: 'aaa'})
      expect( newState.get('username')).toBe('aaa')
    })
})
