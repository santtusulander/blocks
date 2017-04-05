import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../action-items')
import ActionItems from '../action-items'

describe('ActionItems', () => {
  let subject, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        fields: {
          map: () => {}
        }
      }
      return shallow(<ActionItems {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
