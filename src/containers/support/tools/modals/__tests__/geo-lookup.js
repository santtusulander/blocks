import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../geo-lookup')
import ModalGeoLookup from '../geo-lookup'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('ModalGeoLookup', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        intl: intlMaker()
      }
      return shallow(<ModalGeoLookup {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
