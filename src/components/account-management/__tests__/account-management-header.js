import React from 'react'
import { shallow } from 'enzyme'

jest.dontMock('../account-management-header.jsx')
const AccountManagementHeader = require('../account-management-header.jsx').AccountManagementHeader

describe('AccountManagementHeader', () => {
  it('should exist', () => {
    const header = shallow(<AccountManagementHeader/>)
    expect(header.length).toBe(1)
  })

  it('should handle add button click', () => {
    const onAdd = jest.genMockFunction()
    const header = shallow(<AccountManagementHeader onAdd={onAdd}/>)
    header.find('ButtonWrapper').simulate('click')
    expect(onAdd.mock.calls.length).toBe(1)
  })
})
