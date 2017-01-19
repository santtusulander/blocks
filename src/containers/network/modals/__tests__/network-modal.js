import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../network-modal.jsx')
jest.genMockFromModule('react-bootstrap')
import NetworkFormContainer from '../network-modal.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('NetworkFormContainer', () => {
  let subject = null

  beforeEach(() => {
    subject = () => {
      let props = {
        closeModal: jest.fn(),
        onSave: jest.fn(),
        handleSubmit: jest.fn(),
        intl: intlMaker(),
        initialValues: {
          name: 'test network',
          description: 'test description'
        }
      }
      return shallow(<NetworkFormContainer {...props}/>)
    }
  })

 it('should exist', () => {
   expect(subject().length).toBe(1)
 })
})
