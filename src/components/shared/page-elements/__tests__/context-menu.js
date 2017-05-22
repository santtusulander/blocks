import React from 'react'
import { shallow } from 'enzyme'
import { MenuItem } from 'react-bootstrap'

jest.unmock('../context-menu')
import ContextMenu from '../context-menu'

const download = jest.genMockFunction()
const deleteFile = jest.genMockFunction()

const fileName = 'test.avi'

const options = [
  {
    label: 'Download',
    handleClick: download
  },
  {
    label: 'Delete',
    handleClick: deleteFile
  }
]

const props = {
  header: fileName,
  options
}

describe('ContextMenu', () => {
  it('should exist', () => {
    expect(shallow(<ContextMenu {...props}/>)).toBeTruthy()
  })

  it('should have 3 menu items', () => {
    const subject = shallow(<ContextMenu {...props}/>)
    expect(subject.find(MenuItem).length).toBe(3)
  })

  it('should have 1 menu-header', () => {
    const subject = shallow(<ContextMenu {...props}/>)
    expect(subject.find('.menu-header').length).toBe(1)
  });

  it('should call deleteFile function with correct fileName', () => {
    const subject = shallow(<ContextMenu {...props}/>)
    const DeleteItem = subject.find(MenuItem).at(2).simulate('click', { preventDefault: jest.fn(), stopPropagation: jest.fn() })
    expect(deleteFile.mock.calls.length).toBe(1)
    expect(deleteFile.mock.calls[0][0]).toBe(fileName)
  })
})
