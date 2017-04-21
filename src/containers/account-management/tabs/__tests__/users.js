import React from 'react'
import { Router } from 'react-router'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../users.jsx');
import Users from '../users.jsx'

jest.unmock('../../../../util/helpers.js')
import { getSortData } from '../../../../util/helpers.js'

jest.unmock('../../../__mocks__/gen-async');
import { genAsyncMock } from '../../../__mocks__/gen-async'

jest.unmock('../../../__mocks__/router');
import { Router as routerMock } from '../../../__mocks__/router'

describe('AccountManagementAccountUsers', () => {
  it('should exist', () => {
    const users = TestUtils.renderIntoDocument(
      <Users
        account={Immutable.Map()}
        currentUser= {'dummy' }
        deleteUser= { jest.fn() }
        fetchUsers= { jest.fn() }
        fetchGroups= { jest.fn() }
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
        fetchRoleNames={jest.fn()}
        route={ {} }
        router={ routerMock }
        uiActions= {{}}
        userActions={ {
          fetchUsers: genAsyncMock,
        }}
        location={{query: {}}}
        users={ Immutable.List() }
      />
    )
    expect(TestUtils.isCompositeComponent(users)).toBeTruthy()
  })
})
