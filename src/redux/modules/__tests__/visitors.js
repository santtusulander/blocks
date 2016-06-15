jest.unmock('../visitors.js')
jest.unmock('moment')

import {
  fetchedByTimeSuccess,
  fetchedByTimeFailure,
  fetchedByCountrySuccess,
  fetchedByCountryFailure,
  fetchedByBrowserSuccess,
  fetchedByBrowserFailure,
  fetchedByOSSuccess,
  fetchedByOSFailure,
  reset,
  startedFetch,
  finishedFetch,
  emptyTraffic
} from '../visitors.js'

import { is, Map } from 'immutable'

describe('Visitors Module', () => {
  let state = Map();
  beforeEach(() => {
    state = emptyTraffic
  })

  it('should handle fetchedByTimeSuccess', () => {
    const newState = fetchedByTimeSuccess(state, { payload: { data: [{ timestamp: 1460552400 }] } })
    expect(newState.get('byTime').size).toBe(1)

  })

  it('should handle fetchedByTimeFailure', () => {
    const newState = fetchedByTimeFailure(state)
    expect(newState.get('byTime').size).toBe(0)
  })

  it('should handle fetchedByCountrySuccess', () => {
    const newState = fetchedByCountrySuccess(state, { payload: { data: { countries: [ 'foo' ] } } })
    expect(newState.get('byCountry').get('countries').get(0)).toBe('foo')
  })

  it('should handle fetchedByCountryFailure', () => {
    const newState = fetchedByCountryFailure(state)
    expect(newState.get('byCountry').get('countries').size).toBe(0)
  })

  it('should handle fetchedByBrowserSuccess', () => {
    const newState = fetchedByBrowserSuccess(state, { payload: { data: { browsers: [ 'foo' ] } } })
    expect(newState.get('byBrowser').get('browsers').get(0)).toBe('foo')
  })

  it('should handle fetchedByBrowserFailure', () => {
    const newState = fetchedByBrowserFailure(state)
    expect(newState.get('byBrowser').get('browsers').size).toBe(0)

  })

  it('should handle fetchedByOSSuccess', () => {
    const newState = fetchedByOSSuccess(state, { payload: { data: { os: [ 'foo' ] } } })
    expect(newState.get('byOS').get('os').get(0)).toBe('foo')
  })

  it('should handle fetchedByOSFailure', () => {
    const newState = fetchedByOSFailure(state)
    expect(newState.get('byOS').get('os').size).toBe(0)
  })

  it('should handle reset', () => {
    const newState = reset(state)
    expect(is(newState, state)).toBe(true)

  })

  it('should handle startedFetch', () => {
    const newState = startedFetch(state)
    expect(newState.get('fetching')).toBeTruthy()
  })

  it('should handle finishedFetch', () => {
    const newState = finishedFetch(state)
    expect(newState.get('fetching')).toBeFalsy()
  })
})
