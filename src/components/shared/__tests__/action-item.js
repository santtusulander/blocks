import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../action-item')
import ActionItem from '../action-item'

describe('ActionItem', () => {
  let subject, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        input: {
          value: true
        },
      }
      return shallow(<ActionItem {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
