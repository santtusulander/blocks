import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../server-validation')
import ModalServerValidation from '../server-validation'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('ModalServerValidation', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        intl: intlMaker()
      }
      return shallow(<ModalServerValidation {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
