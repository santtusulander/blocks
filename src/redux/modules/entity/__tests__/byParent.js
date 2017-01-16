jest.unmock('../byParentReducers')

import {
  receiveSuccess,
  receiveAllSuccess,
  removeSuccess,
  actionFailed
} from '../byParentReducers'

describe('byParentReducers Module', () => {
  it('should append group arrayon "receiveSuccess"', () => {
    const oldState = {
      2: [11]
    }

    const newItem = {
      "id": 3,
      "asn": "AS1234",
      "name": "asn1234",
      "description": "Autonomous System Number 1234",
      "routing_daemons": [1]
    }

    const newState = receiveSuccess( oldState, {payload: {data: newItem, parentId: 2}} )
    expect(newState[2]).toEqual([11,3])
  })

  it('should append new items on "receiveAllSuccess"', () => {
    const oldState = {
      2: [11]
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

    const newState = receiveAllSuccess( oldState, {payload: {data: newItems, parentId: 2}} )

    expect(newState[2]).toEqual([11,1,3])
  })

  it('should remove item on "removeSuccess"', () => {
    const oldState = {
      2: [11,22]
    }

    const newState = removeSuccess( oldState, {payload: {id: 22, parentId: 2}})
    expect(newState[2]).toEqual([11])
  })

  it('should not add duplicates on receiveSuccess', () =>{

  })

  it('should not add duplicates on receiveAllSuccess', () =>{

  })
});
