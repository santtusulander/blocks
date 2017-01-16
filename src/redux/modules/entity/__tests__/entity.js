jest.unmock('../reducers')

import {
  receiveSuccess,
  receiveAllSuccess,
  removeSuccess,
  actionFailed
} from '../reducers'

describe('Entity Module', () => {
  it('should append new item on "receiveSuccess"', () => {
    const oldState = {
      2: {test: 'value'}
    }

    const newItem = {
      "id": 3,
      "asn": "AS1234",
      "name": "asn1234",
      "description": "Autonomous System Number 1234",
      "routing_daemons": [1]
    }

    const newState = receiveSuccess( oldState, {payload: {data: newItem}, parentId: 11} )

    expect(newState[3]).toEqual(newItem)
    expect(newState[2]).toEqual({test: 'value'})
  })

  it('should append new items on "receiveAllSuccess"', () => {
    const oldState = {
      2: {test: 'value'}
    }

    const asn1 = {
      "id": 1,
      "asn": "AS1",
      "name": "asn1",
      "description": "Autonomous System Number 1",
      "routing_daemons": [1]
    }

    const asn3 = {
      "id": 3,
      "asn": "AS3",
      "name": "asn3",
      "description": "Autonomous System Number 3",
      "routing_daemons": [1]
    }

    const newItems = [ asn1, asn3 ]

    const newState = receiveAllSuccess( oldState, {payload: {data: newItems}, parentId: 11} )

    expect(newState[1]).toEqual(asn1)
    expect(newState[3]).toEqual(asn3)
    expect(newState[2]).toEqual({test: 'value'})
  })

  it('should remove item on "removeSuccess"', () => {
    const oldState = {
      1: {test: 'value1'},
      2: {test: 'value2'}
    }

    const newState = removeSuccess( oldState, {payload: {id: 2}})
    expect(newState[1]).toEqual({test: 'value1'})
    expect(newState[2]).toBeUndefined()
  })

  it('should handle action failure', () => {
    const oldState = {
      1: {test: 'value1'},
      2: {test: 'value2'}
    }

    const newState = actionFailed( oldState, {payload: {id: 2}})
    expect(newState).toEqual(oldState)
  })
});
