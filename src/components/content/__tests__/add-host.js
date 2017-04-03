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
        handleSubmit: jest.fn(),
        activeGroup: Immutable.Map(),
        hasVODSupport: true,
        createHost,
        cancelChanges,
      }
      return shallow(<AddHost {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

})
