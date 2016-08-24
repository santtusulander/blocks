jest.unmock('../dns-records/reducers.js')

import {
  receiveResourcesList,
  resourcesListFailed,
  receiveResourceDetails,
  resourceDetailsFailed,

  } from '../dns-records/reducers.js'

import Immutable from 'immutable'
const resourceObj = {
  resource: 'name one',
  data: [
    {
      name: 'rr1',
      class: 'A'
    },
    {
      name: 'rr2',
      class: 'AAA'
    },
  ]
}

describe('DnsRecords Module', () => {
  it('should handle receiveResourcesList', () => {
    const oldState = Immutable.fromJS({
      resources: []
    })
    const newState = receiveResourcesList(oldState, { payload: {data: ['one','two']} })
    const expectedState = Immutable.fromJS({
      loading: false,
      resources: [{name: 'one'},{name: 'two'}]
    })

    expect( Immutable.is(newState, expectedState)).toBeTruthy()
  })

  it('should handle resourcesListFailed', () => {
    const oldState = Immutable.fromJS({
      resources: [1,2]
    })
    const newState = resourcesListFailed(oldState)
    const expectedState = Immutable.fromJS({
      resources: [],
      loading: false
    })
    expect( Immutable.is(newState, expectedState)).toBeTruthy()
  })

  it('should handle receiveResourceDetails', () => {
    const oldState = Immutable.fromJS({
      resources: []
    })

    const newState = receiveResourceDetails(oldState, {payload: resourceObj})
    const expectedState = Immutable.fromJS({
      loading: false,
      resources: [
        {
          name: 'name one',
          rr: [
            {
              name: 'rr1',
              class: 'A'
            },
            {
              name: 'rr2',
              class: 'AAA'
            },
          ]
        }
      ]
    })

    expect( Immutable.is(newState, expectedState)).toBeTruthy()
  })

  it('should handle resourceDetailsFailed', () => {
    const oldState = Immutable.fromJS({
      resources: []
    })

    const newState = resourceDetailsFailed(oldState, {payload: []})

    const expectedState = Immutable.fromJS({
      loading: false,
      resources: []
    })

    expect( Immutable.is(newState, expectedState)).toBeTruthy()
  })

  it('should handle createSuccess', () => {
    const oldState = Immutable.fromJS({
      resources: []
    })

    const newState = createSuccess(oldState, {payload: []})

    const expectedState = Immutable.fromJS({
      loading: false,
      resources: []
    })

    expect( Immutable.is(newState, expectedState)).toBeTruthy()
  })

})
