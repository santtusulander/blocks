import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../action-links.jsx')
import ActionLinks from '../action-links.jsx'

describe('UserList', () => {

  it('should exist', () => {
    const links = shallow(<ActionLinks/>)
    expect(links.length).toBe(1)
  })

  it('should call edit function', () => {
    const editFn = jest.genMockFunction()
    const links = shallow(<ActionLinks onEdit={() => editFn(1)}/>)
    links.find('#edit-link').simulate('click')
    expect(editFn.mock.calls[0][0]).toBe(1)
  })

  it('should call delete function', () => {
    const deleteFn = jest.genMockFunction()
    const links = shallow(<ActionLinks onDelete={() => deleteFn(2)}/>)
    links.find('#delete-button').simulate('click')
    expect(deleteFn.mock.calls[0][0]).toBe(2)
  })

})
