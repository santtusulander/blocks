import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../brand-list')
import { BrandList } from '../brand-list'

describe('BrandList', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        brands: ['foo']
      }
      return shallow(<BrandList {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
