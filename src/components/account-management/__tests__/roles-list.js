import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'
import { ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER } from '../../../constants/roles.js'

jest.dontMock('../roles-list.jsx')
const RolesList = require('../roles-list.jsx').RolesList

const fakeRoles = fromJS([
  {id: 1, name: 'UDN Admin', parentRoles: [1], permissions: [1,2,3,4,5,6,7,8,9,10,11,12,13]},
  {id: 2, name: 'Content Provider', parentRoles: [1, 2], permissions: [1,2,3,4,5,6,7]},
  {id: 3, name: 'Service Provider', parentRoles: [1, 3], permissions: [1,2,8]}
])

const fakePermissions = fromJS([
  {id: 1, name: 'Content'},
  {id: 2, name: 'Analytics'},
  {id: 3, name: 'Analytics: CP: Traffic'},
  {id: 4, name: 'Analytics: CP: Unique Visitors'},
  {id: 5, name: 'Analytics: CP: SP Contribution'},
  {id: 6, name: 'Analytics: CP: File Error'},
  {id: 7, name: 'Analytics: CP: URL'},
  {id: 8, name: 'Analytics: SP: On/Off Net'},
  {id: 9, name: 'Security'},
  {id: 10, name: 'Services'},
  {id: 11, name: 'Account'},
  {id: 12, name: 'Config'},
  {id: 13, name: 'Support'}
])

describe('RolesList', () => {

  it('should exist', () => {
    const list = shallow(<RolesList/>)
    expect(list.length).toBe(1)
  })

  it('should list roles', () => {
    const list = shallow(
      <RolesList roles={fakeRoles} permissions={fakePermissions}/>
    )
    expect(list.find('.roles-list-row').length).toBe(3)
  })

  it('should show empty message', () => {
    const list = shallow(<RolesList/>)
    expect(list.find('#empty-msg').length).toBe(1)
  })
})
