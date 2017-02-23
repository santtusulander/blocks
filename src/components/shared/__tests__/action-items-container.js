import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../action-items-container')
import ActionItemsContainer from '../action-items-container'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('ActionItemsContainer', () => {
  let subject, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        addAvailableAction: () => {},
        addNewAction: () => {},
        availableActions: ['item 1', 'item 2'],
        editAction: () => {},
        intl: intlMaker()
      }
      return shallow(<ActionItemsContainer {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
