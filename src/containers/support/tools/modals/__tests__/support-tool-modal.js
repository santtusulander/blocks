import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../support-tool-modal')
import SupportToolModal from '../support-tool-modal'

describe('SupportToolModal', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<SupportToolModal {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
