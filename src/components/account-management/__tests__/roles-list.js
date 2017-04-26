import React from 'react'
import { fromJS } from 'immutable'
import {shallow} from 'enzyme'

jest.unmock('../role-edit/roles-list.jsx')
jest.unmock('../../../components/shared/action-buttons.jsx')
jest.unmock('../../shared/table-sorter.jsx')
jest.unmock('../account-management-header.jsx')
jest.unmock('../../shared/page-elements/array-td.jsx')
import RolesList from '../role-edit/roles-list.jsx'

const fakeRoles = fromJS([
  {id: 1, name: 'UDN Admin', parentRoles: [1], permissions: {
    aaa: {
      content: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      }
    },
    north: {
      analytics: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      }
    },
    ui: {
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
    aaa: {
      content: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      }
    },
    north: {
      analytics: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      }
    },
    ui: {
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
    aaa: {
      content: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      }
    },
    north: {
      analytics: {
        list: {allowed: true},
        create: {allowed: true},
        show: {allowed: true},
        modify: {allowed: true},
        delete: {allowed: true}
      }
    },
    ui: {
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

const fakePermissions = fromJS({
  aaa :
    [{name: 'content', title: 'Content'}]
  ,
  north :
    [{name: 'analytics', title: 'Analytics'}]
  ,
  UI : {
    name: 'UI',
    type: 'ui',
    resources: [{name: 'analytics_cp_traffic', title: 'Analytics: CP: Traffic'}]
  }
})

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('RolesList', () => {
  it('should exist', () => {
    const rolesList = shallow(<RolesList intl={intlMaker()}/>)
    expect(rolesList.length).toBe(1);
  });

  it('should list roles', () => {
    const rolesList = shallow(
      <RolesList roles={fakeRoles} permissions={fakePermissions}
        intl={intlMaker()}/>
    )
    expect(rolesList.find('tr').length).toBe(4)
  });

  it('should show empty message', () => {
    const rolesList = shallow(<RolesList intl={intlMaker()}/>)
    expect(rolesList.find('#empty-msg').length).toBe(1)
  });

  it('can sort roles', () => {
    const rolesList = shallow(
      <RolesList roles={fakeRoles} permissions={fakePermissions}
        intl={intlMaker()}/>
    )
    let names = rolesList.find('.name-0')
    expect(names.text()).toContain('UDN Admin')
    rolesList.instance().changeSort('name', 1)
    rolesList.update()
    names = rolesList.find('.name-0')
    expect(names.text()).toContain('Content Provider')
  });
})
