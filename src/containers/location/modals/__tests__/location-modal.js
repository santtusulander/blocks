import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../location-modal.js')
jest.genMockFromModule('react-bootstrap')
import LocationFormContainer from '../location-modal'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('LocationFormContainer', () => {
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
      return shallow(<LocationFormContainer {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
