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
        onCancel: jest.fn(),
        onSave: jest.fn(),
        onSubmit: jest.fn(),
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
