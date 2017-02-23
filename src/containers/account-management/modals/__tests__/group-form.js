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

function uiActionsMaker() {
  return {
    showInfoDialog: jest.fn(),
    hideInfoDialog: jest.fn(),
    changeNotification: jest.fn()
  }
}

const props = {
  hostActions: hostActionsMaker(),
  fetchLocations: jest.fn(),
  fetchServiceInfo: jest.fn(),
  uiActions: uiActionsMaker(),
  params: { brand: 'foo', account: 'bar', group: '123' }
}

const subject = shallow(
  <GroupFormContainer {...props}/>
)

describe('GroupFormContainer', () => {
  it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
