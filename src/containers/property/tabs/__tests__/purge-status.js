import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../purge-status')
import PurgeStatus from '../purge-status'

function purgeActionsMaker() {
  return {
    startFetching: jest.fn(),
    fetchPurgeObjects: jest.fn()
  }
}

describe('PurgeStatus', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        purgeActions: purgeActionsMaker()
      }
      return shallow(<PurgeStatus {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
