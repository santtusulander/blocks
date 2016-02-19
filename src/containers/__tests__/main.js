import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.autoMockOff()

jest.dontMock('../main.jsx')
const Main = require('../main.jsx').Main

function uiActionsMaker() {
  return {
    changeTheme: jest.genMockFunction()
  }
}

function purgeActionsMaker() {
  return {
    createPurge: jest.genMockFunction().mockReturnValue({
      then: (cb => cb())
    }),
    resetActivePurge: jest.genMockFunction(),
    updateActivePurge: jest.genMockFunction()
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

describe('Main', () => {
  it('should exist', () => {
    let main = TestUtils.renderIntoDocument(
      <Main routes={['foo']} uiActions={uiActionsMaker()} theme="dark" />
    );
    expect(TestUtils.isCompositeComponent(main)).toBeTruthy();
  });
  it('should activate a property to purge', () => {
    let main = TestUtils.renderIntoDocument(
      <Main routes={['foo']}
        uiActions={uiActionsMaker()}
        purgeActions = {purgeActionsMaker()}
        activePurge={fakePurge}
        theme="dark" />
    );
    expect(main.state.activePurge).toBe(null);
    main.activatePurge('aaa')()
    expect(main.state.activePurge).toBe('aaa');
  });
  it('should create a new purge', () => {
    const purgeActions = purgeActionsMaker()
    let main = TestUtils.renderIntoDocument(
      <Main routes={['foo']}
        uiActions={uiActionsMaker()}
        properties={fakeProperties}
        activePurge={fakePurge}
        purgeActions={purgeActions}/>
    );
    main.activatePurge(0)()
    main.saveActivePurge()
    expect(purgeActions.createPurge.mock.calls[0][0]).toBe('udn')
    expect(purgeActions.createPurge.mock.calls[0][1]).toBe(1)
    expect(purgeActions.createPurge.mock.calls[0][2]).toBe(1)
    expect(purgeActions.createPurge.mock.calls[0][3]).toBe('www.foobar.com')
    expect(purgeActions.createPurge.mock.calls[0][4]).toEqual(fakePurge.toJS())
  });
})
