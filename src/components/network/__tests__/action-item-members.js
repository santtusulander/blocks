import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../action-item-members')
import ActionItemMembers from '../action-item-members'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('ActionItemMembers', () => {
  let subject, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        fields: {
          map: () => {}
        },
        intl: intlMaker()
      }
      return shallow(<ActionItemMembers {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
