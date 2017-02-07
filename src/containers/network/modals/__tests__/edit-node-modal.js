import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../edit-node-modal.jsx')
jest.genMockFromModule('react-bootstrap')
import NetworkEditNodeFormContainer from '../edit-node-modal.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

const mockNodes = [
  {
    id: 'abc.def.123.456',
    name: 'First node',
    node_role: 'cache',
    node_env: 'staging',
    node_type: 'udn_core',
    cloud_driver: 'do',
    custom_grains: 'test 1',
    created: '2016-12-05 12:10:06',
    updated: '2017-01-16 05:04:03'
  },
  {
    id: 'def.ghj.789.012',
    name: 'Second node',
    node_role: 'cache',
    node_env: 'production',
    node_type: 'udn_core',
    cloud_driver: 'ec2',
    custom_grains: 'test 2',
    created: '2016-12-05 12:10:06',
    updated: '2017-01-10 05:04:03'
  }
]

describe('NetworkAEditNodeFormContainer', () => {
  let subject = null

  beforeEach(() => {
    subject = () => {
      let props = {
        closeModal: jest.fn(),
        onSave: jest.fn(),
        intl: intlMaker(),
        nodes: mockNodes
      }
      return shallow(<NetworkEditNodeFormContainer {...props}/>)
    }
  })

 it('should exist', () => {
   expect(subject().length).toBe(1)
 })
})
