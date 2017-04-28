import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../content.jsx')
import ContentTransition from '../content.jsx'

describe('ContentTransition', () => {
  it('should exist', () => {
    expect(shallow(<ContentTransition location={{pathname: 'path'}}><div /></ContentTransition>)).toBeTruthy();
  })
})
