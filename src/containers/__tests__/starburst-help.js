import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme';

jest.unmock('../starburst-help.jsx')
import StarburstHelp from '../starburst-help'

const fakeHistory = {
  goBack: jest.genMockFunction()
}

describe('StarburstHelp', () => {
  it('should exist', () => {
    const wrapper = shallow(<StarburstHelp history={fakeHistory} />)
    expect(TestUtils.isCompositeComponent(wrapper)).toBeTruthy()
  })
})
