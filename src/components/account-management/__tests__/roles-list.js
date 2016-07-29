import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'
import { ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER } from '../../../constants/roles.js'

jest.dontMock('../roles-list.jsx')
const RolesList = require('../roles-list.jsx').RolesList

const fakeRoles = fromJS([
  {id: 1, name: 'UDN Admin', parentRoles: [1], permissions: {
    resources: {
      content: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      },
      analytics: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      },
      analytics_cp_traffic: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      }
    }
  }},
  {id: 2, name: 'Content Provider', parentRoles: [2], permissions: {
    resources: {
      content: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      },
      analytics: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      },
      analytics_cp_traffic: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      }
    }
  }},
  {id: 3, name: 'Service Provider', parentRoles: [3], permissions: {
    resources: {
      content: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      },
      analytics: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      },
      analytics_cp_traffic: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      }
    }
  }}
])

const fakePermissions = fromJS([
  {id: 'content', name: 'Content'},
  {id: 'analytics', name: 'Analytics'},
  {id: 'analytics_cp_traffic', name: 'Analytics: CP: Traffic'}
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
