import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../action-item-buttons')
import ActionItemButtons from '../action-item-buttons'

describe('ActionItemButtons', () => {
  let subject, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        input: {
          value: true
        },
      }
      return shallow(<ActionItemButtons {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
