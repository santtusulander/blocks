import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'
import { Link } from 'react-router'

jest.autoMockOff()
jest.dontMock('../content-item-chart.jsx')
const ContentItemChart = require('../content-item-chart.jsx')

describe('ContentItemChart', () => {
  it('should exist', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemChart account={Immutable.Map()}>
        <Link to="/"/>
      </ContentItemChart>
    );
    expect(TestUtils.isCompositeComponent(contentItem)).toBeTruthy();
  })
})
