import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../pop-form.jsx')
jest.genMockFromModule('react-bootstrap')
import NetworkPopFormContainer from '../pop-modal.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('NetworkPopFormContainer', () => {
  let subject = null

  beforeEach(() => {
    subject = (edit = false) => {
      let props = {
        closeModal: jest.fn(),
        onSave: jest.fn(),
        handleSubmit: jest.fn(),
        intl: intlMaker(),
        initialValues: {
          name: 'udn'
        },
        edit: edit
      }
      return shallow(<NetworkPopFormContainer {...props}/>)
    }
  })

 it('should exist', () => {
   expect(subject().length).toBe(1)
 })
})
