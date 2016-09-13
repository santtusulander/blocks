import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

jest.dontMock('../change-log.jsx')
const ConfigurationChangeLog = require('../change-log.jsx')

describe('ConfigurationChangeLog', () => {
  it('should exist', () => {
    const changeLog = shallow(<ConfigurationChangeLog />)
    expect(changeLog).toBeDefined()
  })
})
