import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../account-chart.jsx')
const AccountChart = require('../account-chart.jsx')

describe('AccountChart', () => {
  it('should exist', () => {
    let account = TestUtils.renderIntoDocument(
      <AccountChart account={Immutable.Map()}/>
    );
    expect(TestUtils.isCompositeComponent(account)).toBeTruthy();
  })
})
