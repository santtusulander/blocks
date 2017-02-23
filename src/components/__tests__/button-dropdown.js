import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../button-dropdown')
import ButtonDropdown from '../button-dropdown'

const defaultProps = {
  bsStyle: 'success',
  disabled: false,
  options: [
    {
      label:'New File Upload',
      handleClick: jest.fn()
    },
    {
      label:'New Folder',
      handleClick: jest.fn()
    }
  ],
  pullRight: true
}


describe('ButtonDropdown', () => {
  it('should exist', () => {
    const button = shallow(<ButtonDropdown {...defaultProps}/>)
    expect(button.length).toBe(1)
  })
})
