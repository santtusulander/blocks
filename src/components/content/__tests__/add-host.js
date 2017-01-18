import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'
import { shallow, mount } from 'enzyme'

jest.unmock('../add-host.jsx')
import AddHost from '../add-host'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('AddHost', () => {
  const createHost = jest.genMockFunction()
  const cancelChanges = jest.genMockFunction()
  let subject, error, props = null
  let touched = false
  beforeEach(() => {
    subject = () => {
      props = {
        intl: intlMaker(),
        errors: {},
        createHost,
        cancelChanges,
        fields: {
          hostName: { touched, error, value: 'new' },
          deploymentMode: { touched, error, value: 'trial' }
        }
      }
      return shallow(<AddHost {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
  it('should create host on submit', () => {

    const input = subject().find('#host_name')
    subject().find('#save_button').simulate('click', {
      preventDefault: jest.fn()
    })
    expect(createHost.mock.calls[0][0]).toEqual('new')
    expect(createHost.mock.calls[0][1]).toEqual('trial')
  })
})
