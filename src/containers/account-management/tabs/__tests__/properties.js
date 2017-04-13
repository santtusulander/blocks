import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../properties.jsx')
import Properties from '../properties.jsx'

jest.unmock('../../../../util/helpers.js')

jest.unmock('../../../../redux/modules/fetching/actions')

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fakeAccount = Immutable.fromJS({id: 11, brand_id: 'udn'})
const fakeGroups = Immutable.fromJS({id: 1, name: 'Group A'})
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
      deployment_mode: 'development',
      configurations: [{
        edge_configuration: {
          origin_type: 'cis',
          origin_host_name: 'china.storage.gateway.host.net'
        }
      }]
    }]
  }
])

const propertiesComponent =
  (<Properties
    account={fakeAccount}
    groups={fakeGroups}
    properties={fakeProperties}
    params={{}}
    fetchProperties={jest.fn()}
    intl={intlMaker()} />)

describe('AccountManagementProperties', () => {
  it('should exist', () => {
    const properties = shallow(propertiesComponent)
    expect(properties.length).toBe(1)
  })
})
