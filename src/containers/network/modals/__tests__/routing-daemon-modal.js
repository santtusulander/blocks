import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../routing-daemon-modal.jsx')
jest.genMockFromModule('react-bootstrap')
import RoutingDaemonContainer from '../routing-daemon-modal'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('RoutingDaemonContainer', () => {
  let subject = null

  beforeEach(() => {
    subject = () => {
      let props = {
        closeModal: jest.fn(),
        onSave: jest.fn(),
        handleSubmit: jest.fn(),
        intl: intlMaker(),
        initialValues: {
          bgp_as_number: 'test network',
          bgp_router_ip: '192.168.100.1',
          bgp_password: 'verysecret'
        }
      }
      return shallow(<RoutingDaemonContainer {...props}/>)
    }
  })

 it('should exist', () => {
   expect(subject().length).toBe(1)
 })
})
