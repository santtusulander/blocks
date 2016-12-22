import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../brand-list-row')
import BrandListRow from '../brand-list-row'

describe('BrandListRow', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<BrandListRow {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
