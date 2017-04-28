import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../dialog.jsx')
import Dialog from '../dialog.jsx'

describe('Select', () => {
  it('should exist', () => {
    expect(shallow(<Dialog />).length).toBeTruthy()
  })

  it('can be passed a custom css class', () => {
    expect(shallow(<Dialog className="test" />).find('.test').length).toBeTruthy()
  })
})
