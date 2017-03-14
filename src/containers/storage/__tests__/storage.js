import React from 'react'
import { shallow } from 'enzyme'

import Storage from '../storage.jsx'

jest.unmock('../../../redux/modules/fetching/actions.js')
jest.mock('../../../util/helpers', () => {
  return {
    buildAnalyticsOpts: () => {
      return {startDate: 1, endDate: 2}
    }
  }
})
jest.unmock('../storage.jsx')

let params = {
  storage: 'storage',
  group: 'group'
}

const subject = () => {
  return shallow(
    <Storage params={params} fetchStorage={jest.fn()} fetchStorageMetrics={jest.fn()} />)
}

describe('Storage', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1);
  });
})
