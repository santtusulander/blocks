import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../action-item-member-buttons')
import ActionItemMemberButtons from '../action-item-member-buttons'

describe('ActionItemMemberButtons', () => {
  let subject, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        input: {
          value: true
        },
      }
      return shallow(<ActionItemMemberButtons {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
