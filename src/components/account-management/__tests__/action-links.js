import React from 'react'
import { shallow } from 'enzyme'

jest.dontMock('../action-links.jsx')
const ActionLinks = require('../action-links.jsx').ActionLinks

describe('UserList', () => {

  it('should exist', () => {
    const list = shallow(<ActionLinks/>)
    expect(list.length).toBe(1)
  })

  it('should call edit function', () => {
    const editFn = jest.genMockFunction()
    const list = shallow(<ActionLinks onEdit={() => editFn(1)}/>)
    list.find('.edit-link').simulate('click')
    expect(editFn.mock.calls[0][0]).toBe(1)
  })

  it('should call delete function', () => {
    const deleteFn = jest.genMockFunction()
    const list = shallow(<ActionLinks onDelete={() => deleteFn(2)}/>)
    list.find('#delete').simulate('click')
    expect(deleteFn.mock.calls[0][0]).toBe(2)
  })

})
