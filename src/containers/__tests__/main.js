import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.mock('../../util/helpers', () => {
  return {
    filterAccountsByUserName: jest.genMockFunction()
      .mockImplementation(accounts => accounts),
    getAnalyticsUrl: jest.genMockFunction(),
    getContentUrl: jest.genMockFunction(),
    removeProps: jest.genMockFunction()
  }
})

jest.mock('../../routes', () => {
  return {
    getRoute: jest.genMockFunction()
  }
})

jest.autoMockOff()

jest.dontMock('../main.jsx')
const Main = require('../main.jsx').Main

function uiActionsMaker() {
  return {
    changeTheme: jest.genMockFunction(),
    changeNotification: jest.genMockFunction()
  }
}

function hostActionsMaker() {
  return {
    fetchHost: jest.genMockFunction().mockReturnValue({
      then: (cb => cb({payload: {}}))
    })
  }
}

function purgeActionsMaker() {
  return {
    createPurge: jest.genMockFunction().mockReturnValue({
      then: (cb => cb({payload: {}}))
    }),
    resetActivePurge: jest.genMockFunction(),
    updateActivePurge: jest.genMockFunction()
  }
}

function userActionsMaker(cbResponse) {
  return {
    startFetching: jest.genMockFunction(),
    checkToken: jest.genMockFunction(),
    logOut: jest.genMockFunction().mockImplementation(() => {
      return {then: cb => cb(cbResponse)}
    })
  }
}

function fakeRouterMaker() {
  return {
    push: jest.genMockFunction()
  }
}

const fakeProperties = Immutable.fromJS([
  {
    "account_id": 1, "group_id": 1,
    "property": "www.foobar.com",
    "last_edited": 1451607200,
    "last_editor": "Jenny Steele",
    "status": "production"
  }
])

const fakePurge = Immutable.fromJS({
  action: 'purge',
  objects: [],
  note: '',
  feedback: null
})

const fakeActiveAccount = Immutable.fromJS(
  {"id": 1}
)

const fakeActiveGroup = Immutable.fromJS(
  {"id": 1}
)

const fakeHost = Immutable.fromJS({
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

const fakeFetchAccountData = jest.genMockFunction()

describe('Main', () => {
  it('should exist', () => {
    let main = TestUtils.renderIntoDocument(
      <Main location={fakeLocation} uiActions={uiActionsMaker()}
        userActions={userActionsMaker()} theme="dark"
        params={fakeParams}
        fetchAccountData={fakeFetchAccountData} />
    );
    expect(TestUtils.isCompositeComponent(main)).toBeTruthy();
  });

  it('should activate a property to purge', () => {
    let main = TestUtils.renderIntoDocument(
      <Main location={fakeLocation}
        uiActions={uiActionsMaker()}
        userActions={userActionsMaker()}
        purgeActions = {purgeActionsMaker()}
        activePurge={fakePurge}
        theme="dark"
        params={fakeParams}
        fetchAccountData={fakeFetchAccountData} />
    );
    expect(main.state.activePurge).toBe(null);
    main.activatePurge(1)()
    expect(main.state.activePurge).toBe(1);
  });

  it('should create a new purge', () => {
    const purgeActions = purgeActionsMaker()
    let main = TestUtils.renderIntoDocument(
      <Main location={fakeLocation}
        uiActions={uiActionsMaker()}
        userActions={userActionsMaker()}
        properties={fakeProperties}
        activePurge={fakePurge}
        activeAccount={fakeActiveAccount}
        activeGroup={fakeActiveGroup}
        activeHost={fakeHost}
        purgeActions={purgeActions}
        hostActions={hostActionsMaker()}
        params={fakeParams}
        fetchAccountData={fakeFetchAccountData}/>
    );
    main.activatePurge(fakeProperties.get(0))()
    main.saveActivePurge()
    expect(purgeActions.createPurge.mock.calls[0][0]).toBe('udn')
    expect(purgeActions.createPurge.mock.calls[0][1]).toBe(1)
    expect(purgeActions.createPurge.mock.calls[0][2]).toBe(1)
    expect(purgeActions.createPurge.mock.calls[0][3]).toBe('')
    expect(purgeActions.createPurge.mock.calls[0][4]).toEqual(fakePurge.toJS())
  });

  it('should have .chart-view class when viewing charts', () => {
    let main = TestUtils.renderIntoDocument(
      <Main location={fakeLocation} uiActions={uiActionsMaker()} theme="dark"
        userActions={userActionsMaker()}
        viewingChart={true}
        params={fakeParams}
        fetchAccountData={fakeFetchAccountData} />
    );
    let container = TestUtils.findRenderedDOMComponentWithClass(main, 'main-container');
    expect(ReactDOM.findDOMNode(container).className).toContain('chart-view');
  });

  it('handles a successful log out attempt', () => {
    const userActions = userActionsMaker({})
    const fakeRouter = fakeRouterMaker()
    const main = TestUtils.renderIntoDocument(
      <Main location={fakeLocation}
        uiActions={uiActionsMaker()}
        theme="dark"
        userActions={userActions}
        router={fakeRouter}
        params={fakeParams}
        fetchAccountData={fakeFetchAccountData} />
    )
    main.logOut()
    expect(fakeRouter.push.mock.calls[0]).toContain('/login')
  });
})
