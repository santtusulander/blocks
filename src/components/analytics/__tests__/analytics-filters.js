import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.mock('../../../util/helpers', () => {
  return {
    userIsContentProvider: user => user.get('roles') === 1,
    userIsServiceProvider: user => user.get('roles') === 2,
    userIsCloudProvider: user => user.get('roles') === 3
  }
})

jest.unmock('../analytics-filters.jsx')
import AnalyticsFilters from '../analytics-filters.jsx'

describe('AnalyticsFilters', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = (activeAccountProviderType) => {
      props = {
        activeAccountProviderType: activeAccountProviderType || 1,
        dateRanges: [],
        currentUser: Immutable.Map({roles: activeAccountProviderType || 1}),
        filterOptions: Immutable.Map(),
        filters: Immutable.Map(),
        onFilterChange: () => jest.fn(),
        params: {brand: 'udn'},
        showFilters: Immutable.List([
          'dateRange',
          'serviceProviders',
          'contentProviders',
          'onOffNet',
          'serviceTypes',
          'recordType',
          'errorCodesode',
          'statusCodes',
          'video'
        ])
      }
      return shallow(<AnalyticsFilters {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should render date range selector', () => {
    expect(subject(3).find('FilterDateRange').length).toBe(1)
  })

  it('should render service provider filters', () => {
    expect(subject(1).find('FilterServiceProvider').length).toBe(1)
  })

  it('should render content provider filters', () => {
    expect(subject(2).find('FilterContentProvider').length).toBe(1)
  })

  it('should render on-off net filters', () => {
    expect(subject().find('FilterOnOffNet').length).toBe(1)
  })

  it('should render service type filters', () => {
    expect(subject().find('FilterServiceType').length).toBe(2)
  })

  it('should render record type filters', () => {
    expect(subject().find('FilterRecordType').length).toBe(1)
  })

  it('should render error/status code filters', () => {
    expect(subject().find('StatusCodes').length).toBe(1)
  })

  it('should render video filters', () => {
    expect(subject().find('FilterVideo').length).toBe(1)
  })
})
