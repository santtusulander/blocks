import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../storages.jsx')
import Storages from '../storages.jsx'

jest.unmock('../../../../util/helpers.js')
import { getSortData } from '../../../../util/helpers.js'

jest.unmock('../../../../redux/modules/fetching/actions')
import mapActionsToFetchingReducers from '../../../../redux/modules/fetching/actions'


function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}
const fakeAccount = Immutable.fromJS({id: 11, brand_id: 'udn'})

const fakeGroups = Immutable.fromJS([{id: 1, name: 'Group A'}, {id: 2, name: 'Group B'}])

const fakeStorages = Immutable.fromJS([
  {
   ingest_point_id: 'USA Storage',
   parentId: 1,
   clusters: ['cis-apac-syd-strg0', 'cis-us-sjc-strg0'],
   gateway: {
     hostname: 'usa.storage.gateway.host.net'
   }
  },
  {
   ingest_point_id: 'China Storage',
   parentId: 2,
   clusters: ['cis-apac-syd-strg0'],
   gateway: {
     hostname: 'china.storage.gateway.host.net'
   }
  }
])

const fakeProperties = Immutable.fromJS([
  {
    published_host_id: 'fake.property.net',
    services: [{
      configurations: [{
        edge_configuration: {
          origin_type: 'cis',
          origin_host_name: 'china.storage.gateway.host.net'
        }
      }]
    }]
  }
])

const fakeClusters = Immutable.fromJS([
  {name: 'cis-apac-syd-strg0', description: 'Syndey, Australia, APAC'},
  {name: 'cis-us-sjc-strg0', description: 'San Jose, California, USA'}
])

const fakeMetrics = Immutable.fromJS([
  {
   totals: [{
     bytes: { ending : 108000497044939},
     files_count: { ending: 5000}
   }]
  }
])

const fakefullStorage = Immutable.fromJS([
  {
   ingest_point_id: 'USA Storage',
   group_name: 'Group A',
   parentId: 1,
   clusters: ['cis-apac-syd-strg0', 'cis-us-sjc-strg0'],
   origins: ['usa.storage.gateway.host.net', 'china.storage.gateway.host.net'],
   locations: 'Syndey, San Jose',
   gateway: {hostname: 'usa.storage.gateway.host.net'},
   usage: 108000497044939,
   files_count: 5000
  },
  {
   ingest_point_id: 'China Storage',
   group_name: 'Group B',
   parentId: 2,
   clusters: ['cis-apac-syd-strg0'],
   origins: ['usa.storage.gateway.host.net'],
   locations: 'Syndey',
   gateway: {hostname: 'china.storage.gateway.host.net'},
   usage: 108000497044939,
   files_count: 5000
  }
])

const storagesComponent =
  <Storages
    account={fakeAccount}
    groups={fakeGroups}
    storages={fakeStorages}
    clusters={fakeClusters}
    properties={fakeProperties}
    metrics={fakeMetrics}
    params={{group: "test"}}
    fetchStorages={jest.fn()}
    fetchClusters={jest.fn()}
    fetchProperties={jest.fn()}
    fetchGroupsMetrics={jest.fn()}
    isFetching={false}
    intl={intlMaker()} />

describe('AccountManagementStorages', () => {
  it('should exist', () => {
    const storages = shallow(storagesComponent)
    expect(storages.length).toBe(1)
  })

  it('should show storages', () => {
    const storages = shallow(storagesComponent)
    expect(storages.find('tr').length).toBe(3)
  })

  it('should show all columns', () => {
    const storages = shallow(storagesComponent)
    expect(storages.find('tbody tr').first().find('td').length).toBe(7)
  })

  it('should set sort values for table', () => {
    const storages = shallow(storagesComponent)
    storages.instance().changeSort('name', -1)
    expect(storages.state('sortBy')).toBe('name')
    expect(storages.state('sortDir')).toBe(-1)
  })

  it('should sort storages by name', () =>{
    const storages = shallow(storagesComponent)
    const sortedData = getSortData(fakeStorages, 'ingest_point_id', 1)
    expect(sortedData.first().get('ingest_point_id')).toBe('China Storage')
    const sortedData2 = getSortData(fakeStorages, 'ingest_point_id', -1)
    expect(sortedData2.first().get('ingest_point_id')).toBe('USA Storage')
  })

  it('should search storage', () => {
    const storages = shallow(storagesComponent)
    const filteredData = storages.instance().filterData(fakefullStorage, 'c')
    expect(filteredData.count()).toBe(1)
    expect(filteredData.first().get('ingest_point_id')).toBe('China Storage')
  })

})
