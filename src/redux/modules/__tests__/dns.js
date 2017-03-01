jest.unmock('../dns')

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
  activeDomainChange
} from '../dns'

import { is, fromJS } from 'immutable'

describe('DNS Module', () => {
  let state = null
  beforeEach(() => {
    state = fromJS({
      domains: [{ id: 'aa' }, { id: 'bb' }, { id: 'cc' }]
    })
  })

  it('should handle startedFetching', () => {
    const newState = startedFetching(state)
    expect(is(newState, state.set('fetching', true))).toBeTruthy()
  })

  it('should handle stoppedFetching', () => {
    const newState = stoppedFetching(state)
    expect(is(newState, state.set('fetching', false))).toBeTruthy()
  })

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
    const newState = deleteDomainFailure(state)
    expect(is(newState, state)).toBe(true)
  })

  it('should handle editDomainSuccess', () => {
    const payload = { data: 'data', domain: 'aa' }
    const newState = editDomainSuccess(state, { payload })
    const expectedState = fromJS({
      domains: fromJS([
        { id: payload.domain, details: payload.data },
        { id: 'bb' },
        { id: 'cc' }
      ])
    })
    expect(is(newState, expectedState)).toBe(true)
  })

  it('should handle editDomainFailure', () => {
    const newState = editDomainFailure(state)
    expect(is(newState, state)).toBe(true)
  })

  it('should handle fetchedAllDomainsSuccess', () => {
    const newDomains = [ 'qq', 'ww', 'ee' ]
    const payload = [ {dns_zone_id: 'qq'}, {dns_zone_id: 'ww'}, {dns_zone_id: 'ee'} ]
    const newState = fetchedAllDomainsSuccess(state, { payload })
    const expectedState = state.merge({
      domains: fromJS(newDomains.map(domain => ({ id: domain }))),
      activeDomain: 'qq',
      fetching: false
    })
    expect(is(newState, expectedState)).toBeTruthy()
  })

  it('should handle fetchedAllDomainsFailure', () => {
    const newState = fetchedAllDomainsFailure(state)
    expect(is(newState, state.set('domains', fromJS([])))).toBe(true)
  })

  it('should handle activeDomainChange', () => {
    const newState = activeDomainChange(state, { payload: 'qqq' })
    expect(is(newState, state.set('activeDomain', 'qqq'))).toBe(true)
  })
})
