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

  it('should have menu item', () => {
    const subject = shallow(<ContextMenu {...props}/>)
    expect(subject.find(MenuItem).length).toBeTruthy()
  })

  it('should have 1 menu-header', () => {
    const subject = shallow(<ContextMenu {...props}/>)
    expect(subject.find('.menu-header').length).toBe(1)
  });
})
