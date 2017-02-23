import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'

jest.unmock('../main.jsx')
import { Main } from '../main.jsx'

jest.mock('../../util/helpers', () => {
  return {
    filterAccountsByUserName: jest.fn()
      .mockImplementation(accounts => accounts),
    getAnalyticsUrl: jest.fn(),
    getContentUrl: jest.fn(),
    removeProps: jest.fn()
  }
})

jest.mock('../../routes', () => {
  return {
    getRoute: jest.fn()
  }
})


function uiActionsMaker() {
  return {
    changeTheme: jest.fn(),
    changeNotification: jest.fn(),
    setLoginUrl: jest.fn()
  }
}

function accountActionsMaker() {
  return {
    fetchAccount: jest.fn(),
    fetchAccounts: jest.fn()
  }
}

function groupActionsMaker() {
  return {
    fetchGroup: jest.fn(),
    fetchGroups: jest.fn()
  }
}

function rolesActionsMaker() {
  return {
    fetchRoles: jest.fn()
  }
}

function hostActionsMaker() {
  return {
    fetchHost: jest.fn().mockReturnValue({
      then: (cb => cb({payload: {}}))
    })
  }
}

function userActionsMaker(cbResponse, actionObject) {
  return {
    startFetching: jest.fn(),
    setLogin: jest.fn(),
    fetchUser: jest.fn(),
    destroyStore: jest.fn(),
    checkToken: jest.fn().mockImplementation(() => ({ then: cb => cb(actionObject) })),
    logOut: jest.fn().mockImplementation(() => {
      return {then: cb => cb(cbResponse)}
    })
  }
}

function fakeRouterMaker() {
  return {
    push: jest.fn()
  }
}

const fakeProperties = fromJS([
  {
    "account_id": 1, "group_id": 1,
    "property": "www.test.com",
    "last_edited": 1451607200,
    "last_editor": "Jenny Steele",
    "status": "production"
  }
])

const fakeActiveAccount = fromJS(
  {"id": 1}
)

const fakeActiveGroup = fromJS(
  {"id": 1}
)

const fakeHost = fromJS({
  "services": [{
    "configurations": [{
      "edge_configuration": {
        "published_name": "examplffffffe.com"
      }
    }]
  }]
})

const fakeLocation = {pathname: ''}

const fakeParams = {brand: 'aaa', account: 'bbb', group: 'ccc', property: 'ddd'}

const fakeFetchAccountData = jest.fn()

describe('Main', () => {
  let subject = null
  let props = {}
  let userActions = null
  let router = null
  let rolesActions = null
  let accountActions = null
  let groupActions = null
  let uiActions = null

  beforeEach(() => {
    subject = (error, loggedIn, currentUser, roles) => {
      router = fakeRouterMaker()
      rolesActions = rolesActionsMaker()
      accountActions = accountActionsMaker()
      groupActions = groupActionsMaker()
      uiActions = uiActionsMaker()
      userActions = userActionsMaker(
        () => {},
        { error, payload: { username: 'aa' } }
      )
      props = {
        location: fakeLocation,
        uiActions,
        accounts: fromJS(['asda']),
        accountActions,
        groupActions,
        userActions,
        rolesActions,
        router,
        viewingChart: true,
        currentUser: fromJS(currentUser) || fromJS({}),
        user: fromJS({ loggedIn }),
        properties: fakeProperties,
        activeAccount: fakeActiveAccount,
        activeGroup: fakeActiveGroup,
        activeHost: fakeHost,
        hostActions: hostActionsMaker(),
        params: fakeParams,
        roles: fromJS(roles),
        fetchAccountData: fakeFetchAccountData
      }
      return shallow(<Main {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1);
  });

  it('should check access token', () => {
    subject()
    expect(userActions.checkToken.mock.calls.length).toBe(1);
  });

  it('should fetch user and roles if token check ok', () => {
    subject()
    expect(rolesActions.fetchRoles.mock.calls.length).toBe(1);
    expect(userActions.fetchUser.mock.calls.length).toBe(1);
  });

  /*it('should set login url and redirect to login if token check not ok', () => {
    subject(true)
    expect(uiActions.setLoginUrl.mock.calls.length).toBe(1);
    expect(router.push.mock.calls.length).toBe(1);
  });
  */

  it('should show footer if logged in and not fetching', () => {
    expect(subject(null, true, { a: 'b' }, ['a']).find('Footer').length).toBe(1);
  });

  it('should show header if logged in', () => {
    expect(subject(null, true, { a: 'b' }, ['a']).find('Header').length).toBe(1);
  });

  it('should show navigation if logged in', () => {
    expect(subject(null, true, { a: 'b' }, ['a']).find('Navigation').length).toBe(1);
  });

  it('should show loading spinner if logged in and no current user or roles', () => {
    expect(subject(null, true).find('LoadingSpinner').length).toBe(1);
  });

  it('should have .chart-view class when viewing charts', () => {
    expect(subject(null, true, { a: 'b' }, ['a']).find('.chart-view').length).toBe(1);
  });

  it('handles a successful log out attempt', () => {
    subject().instance().logOut()
    expect(router.push.mock.calls[0]).toContain('/login')
    expect(userActions.destroyStore.mock.calls.length).toBe(1)
    expect(userActions.logOut.mock.calls.length).toBe(1)
  });

  it('should set roles and currentUser in getChildContext()', () => {
    const testUser = fromJS({ a: 'b' })
    const testRoles = fromJS(['b'])

    const wrapper = subject(null, true, testUser, testRoles)
    expect(wrapper.instance().getChildContext()).toEqual({roles: testRoles, currentUser: testUser})
  })
})
