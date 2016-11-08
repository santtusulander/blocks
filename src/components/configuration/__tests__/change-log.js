import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../change-log.jsx')
import ConfigurationChangeLog from '../change-log.jsx'

describe('ConfigurationChangeLog', () => {
  it('should exist', () => {
    const changeLog = shallow(<ConfigurationChangeLog />)
    expect(changeLog).toBeDefined()
  })
})
