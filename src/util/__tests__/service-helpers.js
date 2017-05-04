import { fromJS } from 'immutable'

jest.unmock('../services-helpers')


import * as servicesHelpers from '../services-helpers'

const serviceInfoMock = [
  {
    "options": [
      {
        "id": 1
      },
      {
        "id": 2
      },
      {
        "id": 3
      }
    ],
    "id": 1
  },
  {
    "options": [
    ],
    "id": 2
  },
  {
    "options": [
      {
        "id": 4
      },
      {
        "id": 5
      },
      {
        "id": 6
      }
    ],
    "id": 3
  }
]

const servicesMock = [
  {
    "service_id": 2,
    "options": [
      {
        "option_id": 6
      },
      {
        "option_id": 5
      },
      {
        "option_id": 4
      }
    ]
  },
  {
    "service_id": 3,
    "options": [

    ]
  },
  {
    "service_id": 1,
    "options": [
      {
        "option_id": 3
      },
      {
        "option_id": 1
      },
      {
        "option_id": 2
      }
    ]
  }
]

const servicesIdsMock = [
  {
    id: 2,
    options: [6, 5, 4]
  },
  {
    id: 3,
    options: []
  },
  {
    id: 1,
    options: [3, 1, 2]
  }
]

describe('Service Helpers Utils', () => {
  it('getServicesIds should return services in the proper format', () => {
    expect(servicesHelpers.getServicesIds(fromJS(servicesMock)).toJS()).toEqual(servicesIdsMock)
  })

  it('getServicesFromIds should return services in the proper format', () => {
    expect(servicesHelpers.getServicesFromIds(servicesIdsMock)).toEqual(servicesMock)
  })

  it('getLocationTypeFromBillingMeta should return global as location type', () => {
    const service = {
      service_id: 1,
      billing_meta: {
        charge_number:"C-12345678"
      },
      options: []
    }

    expect(servicesHelpers.getLocationTypeFromBillingMeta(service)).toBe('global')
  })

  it('getLocationTypeFromBillingMeta should return region as location type', () => {
    const service = {
      service_id: 1,
      billing_meta: {
        regions: [  
          {  
            charge_number: "C-12345678",
            region_code: "cis-eu-fra1-strg0"
          },
          {  
            charge_number: "C-12345678",
            region_code: "cis-us-sjc1-strg0"
          }
        ]
      },
      options: []
    }

    expect(servicesHelpers.getLocationTypeFromBillingMeta(service)).toBe('global')
  })

  it('getServiceByOptionId should return proper service by optionId', () => {
    expect(servicesHelpers.getServiceByOptionId(fromJS(serviceInfoMock), 1).toJS()).toEqual(serviceInfoMock[0])
  })

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
