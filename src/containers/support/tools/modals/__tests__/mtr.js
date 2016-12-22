import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../mtr')
import ModalMtr from '../mtr'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('ModalMtr', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        intl: intlMaker()
      }
      return shallow(<ModalMtr {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
