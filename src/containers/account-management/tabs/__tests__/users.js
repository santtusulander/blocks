import React from 'react'
import { Router } from 'react-router'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

jest.unmock('../users.jsx');
import Users from '../users.jsx'

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
