jest.unmock('../user.js')

import {
  startedFetching,
  stoppedFetching,
  createDomainSuccess,
  createDomainFailure,
  deleteDomainSuccess,
  deleteDomainFailure,
  editDomainSuccess,
  editDomainFailure,
  fetchedAllDomainsSuccess,
  fetchedAllDomainsFailure,
  fetchedDomainSuccess,
  fetchedDomainFailure,
  activeDomainChange
} from '../dns'

import { is, fromJS } from 'immutable'

describe('User Module', () => {
  let state = null
  beforeEach(() => {
    state = fromJS({
      domains: [{ id: 'aa' }, { id: 'bb' }, { id: 'cc' }]
    })
  })

  it('should handle startedFetching', () => {
    const newState = startedFetching(state)
    expect(is(newState, state.set('loading', true)).toBeTruthy()
  )

  it('should handle stoppedFetching', () => {
    const newState = stoppedFetching(state)
    expect(is(newState, state.set('loading', false)).toBeTruthy()
  )

  it('should handle createDomainSuccess', () => {
    const payload = { data: 'data', domain: 'domain' }
    const newState = createDomainSuccess(state, { payload })
    const expectedState = state.merge({
      domains: state.get('domains').push(fromJS({ id: payload.domain, details: payload.data }))
    })
    expect(is(newState, expectedState)).toBeTruthy()
  })

  it('should handle createDomainFailure', () => {
    const newState = createDomainFailure(state)
    expect(is(newState, state)).toBe(true)
  })

  it('should handle deleteDomainSuccess', () => {
    const newState = deleteDomainSuccess(state, { payload: 'aa' })
    const expectedState = fromJS({
      domains: fromJS([{ id: 'bb' }, { id: 'cc' }]), activeDomain: 'bb'
    })
    expect(is(newState, expectedState)).toBe(true)
  })

  it('should handle deleteDomainFailure', () => {
    const newState = createDomainFailure(state)
    expect(is(newState, state)).toBe(true)
  })

    expect( Immutable.is(newState, expectedState) ).toBeTruthy()

  })

  it('should handle editDomainSuccess', () => {
    const payload = { data: 'data', domain: 'aa' }
    const newState = deleteDomainSuccess(state, { payload })
    const expectedState = fromJS({
      activeDomain: 'bb',
      domains: fromJS([
        { id: payload.domain, details: payload.data },
        { id: 'bb' },
        { id: 'cc' },
      ])
    })
    expect(is(newState, expectedState)).toBe(true)
  })

  it('should handle editDomainFailure', () => {
    const newState = editDomainFailure(state)
    expect(is(newState, state)).toBe(true)
  })

  it('should handle fetchedAllDomainsSuccess', () => {
    const newState = fetchedAllDomainsSuccess(state)
    const expectedState = Immutable.fromJS({
      currentUser: {},
      fetching: false
    })
    expect( Immutable.is(newState, expectedState)).toBeTruthy()
  })

  it('should handle fetchedAllDomainsFailure', () => {
    const newState = fetchedAllDomainsFailure(state, { payload: [1] })
    const expectedState = Immutable.fromJS({
      allUsers: [1],
      fetching: false
    })
    expect( Immutable.is(newState, expectedState)).toBeTruthy()
  })

  it('should handle fetchedDomainSuccess', () => {
    const newState = fetchedDomainSuccess(state)
    const expectedState = Immutable.fromJS({
      allUsers: [],
      fetching: false
    })
    expect( Immutable.is(newState, expectedState)).toBeTruthy()
  })

  it('should handle activeDomainChange', () => {
    const initialState = Immutable.fromJS({
      allUsers: [
        {email: 'abc'},
        {email: 'def'}
      ],
      fetching: false
    })
    const newState = activeDomainChange(initialState, { payload: 'abc' })
    const expectedState = Immutable.fromJS({
      allUsers: [
        {email: 'def'}
      ],
      fetching: false
    })
    expect( Immutable.is(newState, expectedState)).toBeTruthy()
  })

  it('should handle fetchedDomainFailure', () => {
    const initialState = Immutable.fromJS({
      allUsers: [
        {email: 'abc'}
      ],
      fetching: false
    })
    const newState = fetchedDomainFailure(initialState, { payload: {email: 'def'} })
    const expectedState = Immutable.fromJS({
      allUsers: [
        {email: 'abc'},
        {email: 'def'}
      ],
      fetching: false
    })
    expect( Immutable.is(newState, expectedState)).toBeTruthy()
  })
})
