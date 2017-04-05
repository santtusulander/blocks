import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../sidebar-link.jsx')
import { SidebarLink } from '../sidebar-link.jsx'

describe('SidebarLink', () => {
  it('should exist', () => {
    const link = shallow(<SidebarLink/>);
    expect(link.length).toBe(1);
  })

  it('should have active class', () => {
    const link = shallow(<SidebarLink active={true}/>)
    expect(link.find('.active').length).toBe(1)
  })

  it('should not have active class', () => {
    const link = shallow(<SidebarLink/>)
    expect(link.find('version-link').length).toBe(0)
  })

  it('should fire activation function on click', () => {
    const activate = jest.genMockFunction()
    activate(1)
    const link = shallow(<SidebarLink activate={activate}/>)
    link.find('a').simulate('click', { stopPropagation() {} })
    expect(activate.mock.calls[0][0]).toBe(1)
  })
})

