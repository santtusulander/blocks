import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-modal.jsx')
jest.genMockFromModule('react-bootstrap')
import StorageFormContainer from '../storage-modal.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('StorageFormContainer', () => {
  let subject = null

  beforeEach(() => {
    subject = () => {
      let props = {
        closeModal: jest.fn(),
        onSave: jest.fn(),
        handleSubmit: jest.fn(),
        intl: intlMaker(),
        initialValues: {
          name: 'test network'
        }
      }
      return shallow(<StorageFormContainer {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
