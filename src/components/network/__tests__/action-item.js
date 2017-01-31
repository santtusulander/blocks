import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../action-item')
import ActionItem from '../action-item'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('ActionItem', () => {
  let subject, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        availableMembers: ['item 1', 'item 2'],
        intl: intlMaker()
      }
      return shallow(<ActionItem {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
