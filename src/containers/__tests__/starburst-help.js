import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../starburst-help.jsx')
import StarburstHelp from '../starburst-help.jsx'

const fakeHistory = {
  goBack: jest.fn()
}

describe('StarburstHelp', () => {
  it('should exist', () => {
    expect(shallow(<StarburstHelp history={fakeHistory} />).length).toBe(1)
  })
})
