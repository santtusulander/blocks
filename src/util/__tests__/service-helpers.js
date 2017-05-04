jest.unmock('../services-helpers')
jest.unmock()

import * as servicesHelpers from '../services-helpers'

describe('Service Helpers Utils', () => {
  it('getDefaultService should return default service object for MediaDelivery service', () => {
    const result = {
      service_id: 1,
      billing_meta: {
        flow_direction: ['egress']
      },
      options: []
    }

    expect(servicesHelpers.getDefaultService(1).toJS()).toEqual(result)
  })

  it('getDefaultService should not return flow_direction for non MediaDelivery service', () => {
    const result = {
      service_id: 2,
      billing_meta: {},
      options: []
    }

    expect(servicesHelpers.getDefaultService(2).toJS()).toEqual(result)
  })
})
