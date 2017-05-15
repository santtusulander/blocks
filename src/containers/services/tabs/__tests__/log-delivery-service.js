import React from 'react'
import { shallow } from 'enzyme'
import { List } from 'immutable'

import LogDeliveryService from '../log-delivery-service.jsx'

jest.unmock('../log-delivery-service.jsx')

let params = {
  group: 'group'
}

const subject = () => {
  return shallow(
    <LogDeliveryService
      params={params}
      fetchProperties={jest.fn()}
      properties={List()}
    />)
}

describe('LogDeliveryService', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
