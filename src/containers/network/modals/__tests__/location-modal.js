import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../location-modal.jsx')
jest.genMockFromModule('react-bootstrap')
import NetworkLocationFormContainer from '../location-modal'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('NetworkLocationFormContainer', () => {
  let subject = null

  beforeEach(() => {
    subject = (editMode = false) => {
      let props = {
        fetchIataCodes: jest.fn(),
        onCancel: jest.fn(),
        onSave: jest.fn(),
        onSubmit: jest.fn(),
        onCreate: jest.fn(),
        onDelete: jest.fn(),
        onUpdate: jest.fn(),
        intl: intlMaker(),
        initialValues: {
          groupId: 40038
        },
        editMode
      }
      return shallow(<NetworkLocationFormContainer {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
