import React from 'react'
import { Router } from 'react-router'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../users.jsx');
import Users from '../users.jsx'

jest.unmock('../../../__mocks__/gen-async');
import { genAsyncMock } from '../../../__mocks__/gen-async'

describe('AccountManagementAccountUsers', () => {
  it('should exist', () => {
    const users = TestUtils.renderIntoDocument(
      <Users
        account={Immutable.Map()}
        currentUser= {'dummy' }
        deleteUser= { jest.fn() }
        formFieldFocus= { jest.fn() }
        groupActions={ {
          fetchGroups: genAsyncMock,
        }}
        groups={Immutable.List()}
        params={{}}
        permissions= {Immutable.Map()}
        permissionsActions={ {
          fetchPermissions: genAsyncMock,
        }}
        resetRoles={ jest.fn() }
        roles={ Immutable.List() }
        rolesActions={ {
          fetchRoles: genAsyncMock,
        }}
        route={ {} }
        router={ routerMock }
        uiActions= {{}}
        userActions={ {
          fetchUsers: genAsyncMock,
        }}
        users={ Immutable.List() }
      />
    )
    expect(TestUtils.isCompositeComponent(users)).toBeTruthy()
  })
})
