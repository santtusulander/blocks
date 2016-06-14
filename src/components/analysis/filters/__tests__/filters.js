import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../filters.jsx')
const Filters = require('../filters.jsx')

const mockServiceTypes = Immutable.List(['foo', 'bar'])

describe('Filters', () => {
  it('should exist', () => {
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}/>
    );
    expect(TestUtils.isCompositeComponent(filters)).toBeTruthy();
  });

  it('should change service provider', () => {
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}/>
    );
    expect(filters.state.activeServiceProvider).toBe('all')
    filters.handleServiceProviderChange('foo')
    expect(filters.state.activeServiceProvider).toBe('foo')
  });

  it('should change pop', () => {
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}/>
    );
    expect(filters.state.activePop).toBe('all')
    filters.handlePopChange('foo')
    expect(filters.state.activePop).toBe('foo')
  });

  it('should change on off net chart type', () => {
    const changeOnOffNetChartType = jest.genMockFunction()
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}
        changeOnOffNetChartType={changeOnOffNetChartType}/>
    );
    filters.handleOnOffNetChartTypeChange('foo')
    expect(changeOnOffNetChartType.mock.calls[0][0]).toEqual('foo')
  });

  it('should toggle service types', () => {
    const toggleServiceType = jest.genMockFunction()
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}
        toggleServiceType={toggleServiceType}/>
    );
    filters.toggleServiceType('zyx')()
    expect(toggleServiceType.mock.calls.length).toBe(1)
    expect(toggleServiceType.mock.calls[0][0]).toEqual('zyx')
  });

  it('should toggle the nav menu', () => {
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}/>
    );
    expect(filters.state.navMenuOpen).toBe(false)
    filters.toggleNavMenu()
    expect(filters.state.navMenuOpen).toBe(true)
  });
})
