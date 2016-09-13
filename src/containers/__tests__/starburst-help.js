import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow, mount } from 'enzyme';

jest.dontMock('../starburst-help.jsx')
import StarburstHelp from '../starburst-help'

const fakeHistory = {
  goBack: jest.genMockFunction()
}

describe('StarburstHelp', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <StarburstHelp history={fakeHistory} />
    )
    expect(TestUtils.isCompositeComponent(wrapper)).toBeTruthy()
  })
})
