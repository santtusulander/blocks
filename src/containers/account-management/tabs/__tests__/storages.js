import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../storages.jsx')
import Storages from '../storages.jsx'

jest.unmock('../../../../util/helpers.js')
import { getSortData } from '../../../../util/helpers.js'


function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fakeStorages = Immutable.fromJS([
  {id: 3, name: 'Media Storage', group: 'Group B', originTo: 'foobar.com', location: 'Frankfurt', usage: '450 GB', files: 1404},
  {id: 1, name: 'Asia Storage', group: 'Group C', originTo: 'mysite.com', location: 'San Jose', usage: '950 GB', files: 28514},
  {id: 2, name: 'Dataphone Storage', group: 'Group A', originTo: 'barfoo.com', location: 'Hong Kong', usage: '100 GB', files: 52}
])

const storagesComponent =
  <Storages
    storages={fakeStorages}
    intl={intlMaker()} />

describe('AccountManagementStorages', () => {
  it('should exist', () => {
    const storages = shallow(storagesComponent)
    expect(storages.length).toBe(1)
  })

  it('should show storages', () => {
    const storages = shallow(storagesComponent)
    expect(storages.find('tr').length).toBe(4)
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
    const sortedData = getSortData(fakeStorages, 'name', 1)
    expect(sortedData.first().get('name')).toBe('Asia Storage')
    const sortedData2 = getSortData(fakeStorages, 'name', -1)
    expect(sortedData2.first().get('name')).toBe('Media Storage')
  })

  it('should sort storages by group', () =>{
    const storages = shallow(storagesComponent)
    const sortedData = getSortData(fakeStorages, 'group', 1)
    expect(sortedData.first().get('group')).toBe('Group A')
    const sortedData2 = getSortData(fakeStorages, 'group', -1)
    expect(sortedData2.first().get('group')).toBe('Group C')
  })

  it('should sort storages by origin', () =>{
    const storages = shallow(storagesComponent)
    const sortedData = getSortData(fakeStorages, 'originTo', 1)
    expect(sortedData.first().get('originTo')).toBe('barfoo.com')
    const sortedData2 = getSortData(fakeStorages, 'originTo', -1)
    expect(sortedData2.first().get('originTo')).toBe('mysite.com')
  })

  it('should sort storages by location', () =>{
    const storages = shallow(storagesComponent)
    const sortedData = getSortData(fakeStorages, 'location', 1)
    expect(sortedData.first().get('location')).toBe('Frankfurt')
    const sortedData2 = getSortData(fakeStorages, 'location', -1)
    expect(sortedData2.first().get('location')).toBe('San Jose')
  })

  it('should search groups', () => {
    const storages = shallow(storagesComponent)
    const filteredData = storages.instance().filterData('as')
    expect(filteredData.count()).toBe(1)
    expect(filteredData.first().get('name')).toBe('Asia Storage')
  })

})
