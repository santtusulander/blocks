import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../purge-modal')
import PurgeModal from '../purge-modal'

describe('PurgeModal', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<PurgeModal {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
