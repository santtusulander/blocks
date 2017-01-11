import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../include-comparison')
import FilterIncludeComparison from '../include-comparison'

describe('FilterIncludeComparison', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<FilterIncludeComparison {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
