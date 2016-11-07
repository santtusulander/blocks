import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../account-management-header.jsx')
import { AccountManagementHeader } from '../account-management-header.jsx'

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
