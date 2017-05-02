import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../confirmation.jsx')
import Confirmation from '../confirmation.jsx'

describe('Confirmation', () => {
  it('should exist', () => {
    expect(shallow(<Confirmation />)).toBeTruthy()
  })

  it('can be passed a custom css class', () => {
    expect(shallow(<Confirmation className="foo" />).find('.foo').length).toBeTruthy()
  });
})
