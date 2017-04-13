import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../properties.jsx')
import { PureProperties } from '../properties.jsx'

jest.unmock('../../../../util/helpers.js')

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fakeAccount = Immutable.fromJS({id: 11, name: 'Account A'})
const fakeGroup = Immutable.fromJS({id: 1, name: 'Group A'})
const fakeParams = { brand: 'udn', account: 1, group: 1 }
const fakeProperties = Immutable.fromJS([
  {
    published_host_id: 'Property A',
    parentId: '1',
    locked_at: null,
    status: 1,
    updated: 1492003136,
    description: '',
    services: [{
      service_type: 'large',
      created: 1484651376,
      start_date: 1484651376,
      end_date: 1516187376,
      active_configurations: [],
      updated: 1484651376,
      object_id: '9c16ce6074324e46b632e8a6e6d9e8e6',
      description: '',
      deployment_mode: 'trial',
      configurations: [{
        edge_configuration: {
          origin_type: 'cis',
          origin_host_name: 'china.storage.gateway.host.net'
        }
      }]
    }]
  },
  {
    published_host_id: 'Property B',
    parentId: '1',
    locked_at: null,
    status: 1,
    updated: 1492003137,
    description: '',
    services: [{
      service_type: 'large',
      created: 1484651377,
      start_date: 1484651377,
      end_date: 1516187377,
      active_configurations: [],
      updated: 1484651377,
      object_id: '9c16ce6074324e46b632e8a6e6d9e8e6',
      description: '',
      deployment_mode: 'production',
      configurations: [{
        edge_configuration: {
          origin_type: 'cis',
          origin_host_name: 'china.storage.gateway.host.net'
        }
      }]
    }]
  }
])

const renderProperties = (params) => (
  shallow(<PureProperties
    currentAccount={fakeAccount}
    currentGroup={fakeGroup}
    properties={fakeProperties}
    params={params}
    fetching={false}
    fetchProperties={jest.fn()}
    intl={intlMaker()}
    pagination={{
      filtering: {},
      paging: {},
      sorting: {},
      getQueryParams: jest.fn(),
      registerSubscriber: jest.fn()}} />)
)

describe('AccountManagementProperties', () => {
  it('should exist', () => {
    const properties = renderProperties({})
    expect(properties.length).toBe(1)
  })

  it('should show properties when group is selected', () => {
    const properties = renderProperties(fakeParams)
    expect(properties.find('tr').length).toBe(3)
  })

  it('should show group required text when no group is selected', () => {
    const properties = renderProperties({})
    expect(properties.find('tr').length).toBe(0)
    expect(properties.find('.text-center').length).toBe(1)
  })

  it('should show all columns', () => {
    const properties = renderProperties(fakeParams)
    expect(properties.find('tbody tr').first().find('td').length).toBe(6)
  })

  it('should set sort criteria properly', () => {
    const properties = renderProperties(fakeParams)
    properties.instance().changeSort('name', -1)
    expect(properties.state('sortBy')).toBe('name')
    expect(properties.state('sortDir')).toBe(-1)
  })

  it('should allow search through properties', () => {
    const properties = renderProperties(fakeParams)
    const filteredData = properties.instance().getFilteredData(fakeProperties, 'property a')
    expect(filteredData.count()).toBe(1)
    expect(filteredData.first().get('published_host_id')).toBe('Property A')
  })
})
