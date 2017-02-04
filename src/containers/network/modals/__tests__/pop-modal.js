import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../pop-modal.jsx')
jest.genMockFromModule('react-bootstrap')
import PopFormContainer from '../pop-modal.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('PopFormContainer', () => {
  let subject = null

  beforeEach(() => {
    subject = (edit = false) => {
      let props = {
        onCancel: jest.fn(),
        onSave: jest.fn(),
        onSubmit: jest.fn(),
        intl: intlMaker(),
        initialValues: {
          name: 'udn'
        },
        edit: edit
      }
      return shallow(<PopFormContainer {...props}/>)
    }
  })


 it('should exist', () => {
   expect(subject().length).toBe(1)
 })
})
