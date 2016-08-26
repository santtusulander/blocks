jest.unmock('uniqid')
jest.unmock('../dns-records/reducers.js')

import {
  receiveResourcesList,
  resourcesListFailed,
  receiveResourceDetails,
  resourceDetailsFailed,
  createSuccess,
  updateSuccess,
  deleteSuccess,
  setActive,

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
  /*it('should handle receiveResourcesList', () => {
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
   */
  it('should handle createSuccess', () => {
    const oldState = Immutable.fromJS({
      resources: []
    })

    let newRecord = Immutable.fromJS({
      name: 'bbb',
      class: 'A',
      value: 'testvalue',
      ttl: 1600
    })

    const newState = createSuccess(oldState, {payload: {data: newRecord}})

    const id = newState.getIn(['resources', 0, 'id'])

    const expectedState = Immutable.fromJS({
      loading: false,
      resources: [newRecord.set('id', id)]
    })

    expect(Immutable.is(newState, expectedState)).toBeTruthy()
  })

  it('should handle updateSuccess', () => {
    const record = Immutable.fromJS({
      id: 'aaa',
      name: 'bbb',
      class: 'A',
      value: 'testvalue',
      ttl: 1600
    })

    const oldState = Immutable.fromJS({
      resources: [
        record
      ]
    })

    const updatedRecord = Immutable.fromJS({
      id: 'aaa',
      name: 'update bbb',
      class: 'update A',
      value: 'update testvalue',
      ttl: 1800
    })

    const newState = updateSuccess(oldState, {payload: {data: updatedRecord}})

    const expectedState = Immutable.fromJS({
      loading: false,
      resources: [updatedRecord]
    })

    expect(Immutable.is(newState, expectedState)).toBeTruthy()
  })

  it('should handle deleteSuccess', () => {
    const record = Immutable.fromJS({
      id: 'aaa',
      name: 'bbb',
      class: 'A',
      value: 'testvalue',
      ttl: 1600
    })

    const oldState = Immutable.fromJS({
      resources: [
        record
      ]
    })

    const newState = deleteSuccess(oldState, {payload: {data: {id: 'aaa'}}})

    const expectedState = Immutable.fromJS({
      loading: false,
      resources: []
    })

    expect(Immutable.is(newState, expectedState)).toBeTruthy()
  })

  it('should handle setActive', () => {

    const oldState = Immutable.fromJS({
      activeRecord: null
    })

    const expectedState = Immutable.fromJS({
      activeRecord: 'aaa'
    })

    const newState = setActive(oldState, {payload: {data: {id: 'aaa'}}})
    expect(Immutable.is(newState, expectedState)).toBeTruthy()
  })

})
