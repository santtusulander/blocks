import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'

jest.dontMock('../user-list.jsx')
const UserList = require('../user-list.jsx').UserList

const fakeUsers = fromJS([
  {id: 1, name: 'Firstname Lastname', role: 'UDN Superuser', email: 'firstname.lastname@company.com'},
  {id: 2, name: 'Firstname Lastname', role: 'UDN Viewer', email: 'firstname.lastname@company.com'},
  {id: 3, name: 'Firstname Lastname', role: 'UDN Superuser', email: 'firstname.lastname@company.com'},
  {id: 4, name: 'Firstname Lastname', role: 'UDN Viewer', email: 'firstname.lastname@company.com'},
  {id: 5, name: 'Firstname Lastname', role: 'UDN Superuser', email: 'firstname.lastname@company.com'},
  {id: 6, name: 'Firstname Lastname', role: 'UDN Viewer', email: 'firstname.lastname@company.com'}
])

describe('UserList', () => {

  it('should exist', () => {
    const list = shallow(<UserList/>)
    expect(list.length).toBe(1)
  })

  it('should show empty message', () => {
    const list = shallow(<UserList users={fromJS([])}/>)
    expect(list.find('#empty-msg').length).toBe(1)
  })

  it('should list users', () => {
    const list = shallow(<UserList users={fakeUsers}/>)
    expect(list.find('tbody tr').length).toBe(6)
  })
})
