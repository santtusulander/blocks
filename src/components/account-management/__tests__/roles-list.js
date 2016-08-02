import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { fromJS } from 'immutable'

jest.dontMock('../roles-list.jsx')
jest.dontMock('../action-links.jsx')
jest.dontMock('../../table-sorter.jsx')
jest.dontMock('../account-management-header.jsx')
jest.dontMock('../../array-td/array-td.jsx')
const RolesList = require('../roles-list.jsx')

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
  ui :
    [{name: 'analytics_cp_traffic', title: 'Analytics: CP: Traffic'}]

})

describe('RolesList', () => {
  it('should exist', () => {
    let rolesList = TestUtils.renderIntoDocument(
      <RolesList/>
    );
    expect(TestUtils.isCompositeComponent(rolesList)).toBeTruthy();
  });

  it('should list roles', () => {
    let rolesList = TestUtils.renderIntoDocument(
      <RolesList roles={fakeRoles} permissions={fakePermissions}/>
    );
    expect(TestUtils.scryRenderedDOMComponentsWithTag(rolesList, 'tr').length).toBe(4)
  });

  it('should list roles', () => {
    let rolesList = TestUtils.renderIntoDocument(
      <RolesList/>
    );
    expect(TestUtils.scryRenderedDOMComponentsWithTag(rolesList, 'div')[0].textContent).toContain('No roles found')
  });

  it('can sort roles', () => {
    let rolesList = TestUtils.renderIntoDocument(
      <RolesList roles={fakeRoles} permissions={fakePermissions}/>
    );
    let tds = TestUtils.scryRenderedDOMComponentsWithTag(rolesList, 'td');
    expect(tds[0].textContent).toContain('UDN Admin');
    rolesList.changeSort('name', 1)
    tds = TestUtils.scryRenderedDOMComponentsWithTag(rolesList, 'td');
    expect(tds[0].textContent).toContain('Content Provider');
  });
})
