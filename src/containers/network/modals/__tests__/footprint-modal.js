import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../footprint-modal.jsx')
jest.genMockFromModule('react-bootstrap')
import FootprintFormContainer from '../footprint-modal'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('FootprintFormContainer', () => {
  let subject = null

  beforeEach(() => {
    subject = () => {
      let props = {
        onSave: jest.fn(),
        handleSubmit: jest.fn(),
        intl: intlMaker()
      }
      return shallow(<FootprintFormContainer {...props}/>)
    }
  })

 it('should exist', () => {
   expect(subject().length).toBe(1)
 })
})
