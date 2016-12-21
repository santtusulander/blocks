import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../brand-list-used-by')
import BrandlistUsedBy from '../brand-list-used-by'

describe('BrandlistUsedBy', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<BrandlistUsedBy {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
