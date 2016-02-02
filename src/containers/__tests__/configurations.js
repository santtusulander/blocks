import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

const moment = require('moment')

const momentFormatMock = jest.genMockFunction()

moment.mockReturnValue({format:momentFormatMock})

// Don't mock the layout components
jest.dontMock('../../components/layout/content.jsx')
jest.dontMock('../../components/layout/page-container.jsx')

jest.dontMock('../configurations.jsx')
const Configurations = require('../configurations.jsx').Configurations

const fakeAccounts = Immutable.fromJS([
  {"account_id": 1, "name": "AAA"}
])
const fakeGroups = Immutable.fromJS([
  {"account_id": 1, "group_id": 1, "name": "BBB"}
])
const fakeProperties = Immutable.fromJS([
  {
    "account_id": 1, "group_id": 1,
    "property": "www.foobar.com",
    "last_edited": 1451607200,
    "last_editor": "Jenny Steele",
    "status": "production"
  }
])

describe('Configurations', () => {
  it('should exist', () => {
    let configurations = TestUtils.renderIntoDocument(
      <Configurations properties={Immutable.List()} />
    );
    expect(TestUtils.isCompositeComponent(configurations)).toBeTruthy();
  });
  it('should have a loading message', () => {
    let configurations = TestUtils.renderIntoDocument(
      <Configurations fetching={true} />
    );
    let p = TestUtils.findRenderedDOMComponentWithTag(configurations, 'p');
    expect(p.textContent).toContain('Loading');
  });
  it('should activate a property to purge', () => {
    let configurations = TestUtils.renderIntoDocument(
      <Configurations properties={Immutable.List()} />
    );
    expect(configurations.state.activePurge).toBe(null);
    configurations.activatePurge('aaa')()
    expect(configurations.state.activePurge).toBe('aaa');
  });
  it('should show properties', () => {
    let configurations = TestUtils.renderIntoDocument(
      <Configurations
        params={{brand:'abc'}}
        accounts={fakeAccounts}
        groups={fakeGroups}
        properties={fakeProperties}
        fetching={false} />
    );
    let tds = TestUtils.scryRenderedDOMComponentsWithTag(configurations, 'td');
    expect(tds[0].textContent).toContain('www.foobar.com');
  });
})
