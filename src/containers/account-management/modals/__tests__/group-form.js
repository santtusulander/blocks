import React from 'react'
import { shallow } from 'enzyme'

import GroupFormContainer from '../group-form'
jest.unmock('../group-form')
jest.unmock('../../../../decorators/key-stroke-decorator')

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

function hostActionsMaker() {
   return {
     intl: intlMaker(),
     fetchHosts: jest.fn(),
     startFetching: jest.fn()
   }
}

const props = {
  hostActions: hostActionsMaker(),
  params: { brand: 'foo', account: 'bar' },
  fetchServiceInfo: jest.fn()
}

const subject = shallow(
  <GroupFormContainer {...props}/>
)

describe('GroupFormContainer', () => {
  it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
