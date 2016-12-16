import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../starburst-help.jsx')
import StarburstHelp from '../starburst-help.jsx'

const fakeRouter = {
  goBack: jest.fn()
}

describe('StarburstHelp', () => {
  it('should exist', () => {
    expect(shallow(<StarburstHelp router={fakeRouter} />).length).toBe(1)
  })
})
