import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.dontMock('../analyses.jsx')
const Analyses = require('../analyses.jsx').Analyses

describe('Analyses', () => {
  it('should exist', () => {
    let analyses = TestUtils.renderIntoDocument(
      <Analyses />
    );
    expect(TestUtils.isCompositeComponent(analyses)).toBeTruthy();
  });

  it('should have a select component', () => {
    let analyses = TestUtils.renderIntoDocument(
      <Analyses />
    );
    let select = TestUtils.scryRenderedDOMComponentsWithClass(analyses, 'dropdown-select')
    expect(select.length).toBe(1);
  });
})
