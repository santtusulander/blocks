import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../dig')
import ModalDig from '../dig'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('ModalDig', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        intl: intlMaker()
      }
      return shallow(<ModalDig {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
