import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../content-item-chart.jsx')
const ContentItemChart = require('../content-item-chart.jsx')

describe('AccountChart', () => {
  it('should exist', () => {
    let account = TestUtils.renderIntoDocument(
      <ContentItemChart account={Immutable.Map()}/>
    );
    expect(TestUtils.isCompositeComponent(account)).toBeTruthy();
  })
})
