import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../action-buttons.jsx')
import ActionButtons from '../action-buttons.jsx'

describe('ActionButtons', () => {

  it('should exist', () => {
    const links = shallow(<ActionButtons/>)
    expect(links.length).toBe(1)
  })

  it('should call edit function', () => {
    const editFn = jest.genMockFunction()
    const links = shallow(<ActionButtons onEdit={() => editFn(1)}/>)
    links.find('.edit-button').simulate('click')
    expect(editFn.mock.calls[0][0]).toBe(1)
  })

  it('should call delete function', () => {
    const deleteFn = jest.genMockFunction()
    const links = shallow(<ActionButtons onDelete={() => deleteFn(2)}/>)
    links.find('.delete-button').simulate('click')
    expect(deleteFn.mock.calls[0][0]).toBe(2)
  })

})
