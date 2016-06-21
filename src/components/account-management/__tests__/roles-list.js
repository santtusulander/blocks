import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'
import { ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER } from '../../../constants/roles.js'

jest.dontMock('../roles-list.jsx')
const RolesList = require('../roles-list.jsx').RolesList

const fakeRoles = fromJS([
  { id: 1, roleName: 'Role name #1', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER ]  },
  { id: 2, roleName: 'Role name #2', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]  },
  { id: 3, roleName: 'Role name #3', roles: [ ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]  },
  { id: 4, roleName: 'Role name #4', roles: [ ROLE_UDN, ROLE_SERVICE_PROVIDER ]  }
])

describe('RolesList', () => {

  it('should exist', () => {
    const list = shallow(<RolesList/>)
    expect(list.length).toBe(1)
  })

  it('should list roles', () => {
    const list = shallow(<RolesList roles={fakeRoles}/>)
    expect(list.find('RolesListRow').length).toBe(4)
  })

  it('should show empty message', () => {
    const list = shallow(<RolesList/>)
    expect(list.find('#empty-msg').length).toBe(1)
  })
})
